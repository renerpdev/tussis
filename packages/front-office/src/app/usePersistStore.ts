import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Store = {
  isSigningIn: boolean
  setIsSigningIn: (isSigningIn: boolean) => void
  cookiesAccepted: boolean
  setCookiesAccepted: (cookiesAccepted: boolean) => void
}

const usePersistStore = create(
  persist<Store>(
    set => ({
      isSigningIn: false,
      setIsSigningIn: (isSigningIn: boolean) => set({ isSigningIn }),
      cookiesAccepted: false,
      setCookiesAccepted: (cookiesAccepted: boolean) => set({ cookiesAccepted }),
    }),
    {
      name: 'tps',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default usePersistStore
