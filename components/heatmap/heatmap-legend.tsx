export function HeatmapLegend() {
  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md">
      <h4 className="text-sm font-medium mb-2">Intensidade de Infecção</h4>
      <div className="flex items-center space-x-2">
        <div className="flex h-2 w-full rounded-md overflow-hidden">
          <div className="w-1/5 bg-green-500" />
          <div className="w-1/5 bg-yellow-500" />
          <div className="w-1/5 bg-orange-500" />
          <div className="w-1/5 bg-red-500" />
          <div className="w-1/5 bg-purple-500" />
        </div>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>Nenhum</span>
        <span>Baixo</span>
        <span>Medio</span>
        <span>Alto</span>
        <span>Grave</span>
      </div>
    </div>
  )
}
