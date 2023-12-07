import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Store = {
  isSigningIn: boolean
  setIsSigningIn: (isSigningIn: boolean) => void
}

const usePersistStore = create(
  persist<Store>(
    set => ({
      isSigningIn: false,
      setIsSigningIn: (isSigningIn: boolean) => set({ isSigningIn }),
    }),
    {
      name: 'tps',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default usePersistStore
