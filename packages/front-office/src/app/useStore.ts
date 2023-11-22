import { create } from 'zustand'

type State = {
  issuesUpdatedAt: number
  setIssuesUpdatedAt: (issuesUpdatedAt: number) => void
  medsUpdatedAt: number
  setMedsUpdatedAt: (medsUpdatedAt: number) => void
  symptomsUpdatedAt: number
  setSymptomsUpdatedAt: (symptomsUpdatedAt: number) => void
  sidebarOpen: boolean
  setSidebarOpen: (sidebarOpen: boolean) => void
  usersUpdatedAt: number
  setUsersUpdatedAt: (usersUpdatedAt: number) => void
}

const currentTimestamp = Date.now()

export const useStore = create<State>(set => ({
  issuesUpdatedAt: currentTimestamp,
  setIssuesUpdatedAt: (issuesUpdatedAt: number) => set({ issuesUpdatedAt }),
  medsUpdatedAt: currentTimestamp,
  setMedsUpdatedAt: (medsUpdatedAt: number) => set({ medsUpdatedAt }),
  symptomsUpdatedAt: currentTimestamp,
  setSymptomsUpdatedAt: (symptomsUpdatedAt: number) => set({ symptomsUpdatedAt }),
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),
  usersUpdatedAt: currentTimestamp,
  setUsersUpdatedAt: (usersUpdatedAt: number) => set({ usersUpdatedAt }),
}))
