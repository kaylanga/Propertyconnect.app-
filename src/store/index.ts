import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, UserRole } from '../contexts/AuthContext'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        logout: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: 'app-storage',
      }
    )
  )
) 