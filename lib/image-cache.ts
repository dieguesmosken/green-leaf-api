/**
 * Sistema de cache para imagens
 * Armazena imagens processadas em IndexedDB e memória
 */

import React from "react"

interface CachedImage {
  url: string
  blob: Blob
  timestamp: number
  size: number
}

class ImageCache {
  private memoryCache = new Map<string, CachedImage>()
  private dbName = 'ImageCache'
  private dbVersion = 1
  private storeName = 'images'
  private maxMemorySize = 50 * 1024 * 1024 // 50MB
  private maxCacheAge = 7 * 24 * 60 * 60 * 1000 // 7 dias
  private currentMemorySize = 0

  /**
   * Inicializa o IndexedDB
   */
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'url' })
        }
      }
    })
  }

  /**
   * Gera chave única para cache baseada na URL e parâmetros
   */
  private generateCacheKey(url: string, params?: Record<string, any>): string {
    const paramsStr = params ? JSON.stringify(params) : ''
    return `${url}${paramsStr}`
  }

  /**
   * Verifica se item do cache ainda é válido
   */
  private isValid(cachedItem: CachedImage): boolean {
    return Date.now() - cachedItem.timestamp < this.maxCacheAge
  }

  /**
   * Remove itens expirados do cache de memória
   */
  private cleanMemoryCache(): void {
    for (const [key, item] of this.memoryCache.entries()) {
      if (!this.isValid(item)) {
        this.memoryCache.delete(key)
        this.currentMemorySize -= item.size
      }
    }
  }

  /**
   * Libera espaço no cache de memória se necessário
   */
  private makeSpaceInMemory(neededSpace: number): void {
    if (this.currentMemorySize + neededSpace <= this.maxMemorySize) {
      return
    }

    // Remover itens mais antigos primeiro
    const sortedEntries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)

    for (const [key, item] of sortedEntries) {
      this.memoryCache.delete(key)
      this.currentMemorySize -= item.size
      
      if (this.currentMemorySize + neededSpace <= this.maxMemorySize) {
        break
      }
    }
  }

  /**
   * Busca imagem no cache de memória
   */
  private getFromMemory(key: string): CachedImage | null {
    const cached = this.memoryCache.get(key)
    if (cached && this.isValid(cached)) {
      return cached
    }
    if (cached) {
      this.memoryCache.delete(key)
      this.currentMemorySize -= cached.size
    }
    return null
  }

  /**
   * Busca imagem no IndexedDB
   */
  private async getFromDB(key: string): Promise<CachedImage | null> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => {
          const result = request.result
          if (result && this.isValid(result)) {
            resolve(result)
          } else {
            if (result) {
              // Remove item expirado
              this.removeFromDB(key)
            }
            resolve(null)
          }
        }
        request.onerror = () => resolve(null)
      })
    } catch {
      return null
    }
  }

  /**
   * Salva imagem no cache de memória
   */
  private setInMemory(key: string, cachedImage: CachedImage): void {
    this.makeSpaceInMemory(cachedImage.size)
    this.memoryCache.set(key, cachedImage)
    this.currentMemorySize += cachedImage.size
  }

  /**
   * Salva imagem no IndexedDB
   */
  private async setInDB(key: string, cachedImage: CachedImage): Promise<void> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put({ ...cachedImage, url: key })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Falha ao salvar no IndexedDB:', error)
    }
  }

  /**
   * Remove imagem do IndexedDB
   */
  private async removeFromDB(key: string): Promise<void> {
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      store.delete(key)
    } catch (error) {
      console.warn('Falha ao remover do IndexedDB:', error)
    }
  }

  /**
   * Busca imagem no cache
   */
  async get(url: string, params?: Record<string, any>): Promise<string | null> {
    const key = this.generateCacheKey(url, params)
    
    // Tentar cache de memória primeiro
    let cached = this.getFromMemory(key)
    
    // Se não encontrou, tentar IndexedDB
    if (!cached) {
      cached = await this.getFromDB(key)
      if (cached) {
        // Mover para cache de memória
        this.setInMemory(key, cached)
      }
    }
    
    if (cached) {
      return URL.createObjectURL(cached.blob)
    }
    
    return null
  }

  /**
   * Salva imagem no cache
   */
  async set(url: string, blob: Blob, params?: Record<string, any>): Promise<void> {
    const key = this.generateCacheKey(url, params)
    const cachedImage: CachedImage = {
      url: key,
      blob,
      timestamp: Date.now(),
      size: blob.size
    }
    
    // Salvar em ambos os caches
    this.setInMemory(key, cachedImage)
    await this.setInDB(key, cachedImage)
  }

  /**
   * Remove imagem do cache
   */
  async remove(url: string, params?: Record<string, any>): Promise<void> {
    const key = this.generateCacheKey(url, params)
    
    const cached = this.memoryCache.get(key)
    if (cached) {
      this.memoryCache.delete(key)
      this.currentMemorySize -= cached.size
    }
    
    await this.removeFromDB(key)
  }

  /**
   * Limpa todo o cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear()
    this.currentMemorySize = 0
    
    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      store.clear()
    } catch (error) {
      console.warn('Falha ao limpar IndexedDB:', error)
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): {
    memoryItems: number
    memorySize: number
    maxMemorySize: number
  } {
    this.cleanMemoryCache()
    
    return {
      memoryItems: this.memoryCache.size,
      memorySize: this.currentMemorySize,
      maxMemorySize: this.maxMemorySize
    }
  }
}

// Singleton instance
export const imageCache = new ImageCache()

/**
 * Hook para buscar imagem com cache
 */
export const useCachedImage = (url: string | undefined): string | null => {
  const [cachedUrl, setCachedUrl] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    if (!url) {
      setCachedUrl(null)
      return
    }
    
    const loadImage = async () => {
      // Tentar buscar do cache primeiro
      let imageUrl = await imageCache.get(url)
      
      if (!imageUrl) {
        // Se não está no cache, fazer fetch
        try {
          const response = await fetch(url)
          if (response.ok) {
            const blob = await response.blob()
            await imageCache.set(url, blob)
            imageUrl = URL.createObjectURL(blob)
          }
        } catch (error) {
          console.warn('Falha ao carregar imagem:', error)
          imageUrl = url // Fallback para URL original
        }
      }
      
      setCachedUrl(imageUrl)
    }
    
    loadImage()
  }, [url])
  
  return cachedUrl
}
