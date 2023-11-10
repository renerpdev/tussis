import { User } from '@firebase/auth'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type PersistedState = {
  currentUser: null | User
  setCurrentUser: (currentUser: User | null) => void
}

type State = {
  issuesUpdatedAt: number
  setIssuesUpdatedAt: (issuesUpdatedAt: number) => void
  medsUpdatedAt: number
  setMedsUpdatedAt: (medsUpdatedAt: number) => void
  symptomsUpdatedAt: number
  setSymptomsUpdatedAt: (symptomsUpdatedAt: number) => void
}

export const usePersistedStore = create(
  persist<PersistedState>(
    set => ({
      currentUser: null,
      setCurrentUser: (currentUser: User | null) => set({ currentUser }),
    }),
    {
      name: 'tussis-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

const currentTimestamp = Date.now()

export const useStore = create<State>(set => ({
  issuesUpdatedAt: currentTimestamp,
  setIssuesUpdatedAt: (issuesUpdatedAt: number) => set({ issuesUpdatedAt }),
  medsUpdatedAt: currentTimestamp,
  setMedsUpdatedAt: (medsUpdatedAt: number) => set({ medsUpdatedAt }),
  symptomsUpdatedAt: currentTimestamp,
  setSymptomsUpdatedAt: (symptomsUpdatedAt: number) => set({ symptomsUpdatedAt }),
}))
