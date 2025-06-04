"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/firebase"; // Import Firebase auth instance
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth methods

type User = {
  createdAt: any;
  _id: string;
  name: string;
  email: string;
  role: "admin" | "researcher" | "farmer";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUser: (data: { name: string; email: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check auth status using Firebase onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase, now fetch full user data from backend
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Backend couldn't validate user or find user data, sign out from Firebase
            console.error("Backend user data fetch failed:", response.status);
            await signOut(auth);
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data from backend:", error);
          await signOut(auth);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        // User is signed out from Firebase
        setUser(null);
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch full user data from backend after Firebase login
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If backend fetch fails, sign out from Firebase
        await signOut(auth);
        throw new Error(errorData.error || "Failed to fetch user data after login.");
      }

      const data = await response.json();
      setUser(data.user);

    } catch (error: any) {
      console.error("Login error:", error);
      // Firebase errors have a 'code' property
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            throw new Error("Credenciais inválidas.");
          case 'auth/invalid-email':
            throw new Error("Endereço de e-mail inválido.");
          case 'auth/user-disabled':
            throw new Error("Este usuário foi desativado.");
          default:
            throw new Error(`Falha no login. ${error.message}`);
        }
      } else {
         // Handle errors from backend fetch or other issues
         throw new Error(error.message || "Falha no login. Tente novamente.");
      }
    } finally {
      // Setting isLoading to false is now handled by onAuthStateChanged
      // setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Send user data and Firebase UID to your backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: firebaseUser.uid, name, email, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If backend registration fails, consider deleting the Firebase user
        // (This might require Admin SDK on your backend, or a callable Cloud Function)
        console.error("Backend registration failed:", errorData.error);
        // We won't throw here immediately to allow the user to still be logged in via Firebase,
        // but their data in the backend might be incomplete. A better approach would be
        // to use Firebase Cloud Functions to keep Firebase Auth and backend data in sync.
         throw new Error(errorData.error || "Falha ao salvar dados do usuário no backend.");
      }

      const data = await response.json();
      // Update user state with data from backend (should include _id)
      setUser(data.user);

    } catch (error: any) {
      console.error("Registration error:", error);
      // Handle Firebase Auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            throw new Error("Este endereço de e-mail já está em uso.");
          case 'auth/weak-password':
            throw new Error("A senha é muito fraca.");
          case 'auth/invalid-email':
            throw new Error("Endereço de e-mail inválido.");
          default:
            throw new Error(`Falha no registro. ${error.message}`);
        }
      } else {
         // Handle errors from backend call or other issues
         throw new Error(error.message || "Falha no registro. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      // Call backend logout to clear any session/cookie (optional but good practice)
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if backend logout fails, clear client state and redirect
      setUser(null);
      router.push("/login");
    }
  };

  const updateUser = async (data: { name: string; email: string }) => {
    if (!user) return;
    setIsLoading(true);
    try {
       // Assuming user updates are still handled by backend
       // Backend should handle updates in its database and potentially in Firebase Auth if necessary
       const idToken = await auth.currentUser?.getIdToken();
       if (!idToken) throw new Error("User not authenticated.");

      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
         },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar usuário");
      const updated = await response.json();
      setUser(updated.user);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
