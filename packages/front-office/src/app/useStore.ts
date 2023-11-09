import { User } from '@firebase/auth'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type State = {
  currentUser: null | User
  setCurrentUser: (currentUser: User | null) => void
}

const useStore = create(
  persist<State>(
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

export default useStore
