import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { type UserDetails } from '../types/user'

interface AuthStore {
  isLoggedIn: boolean
  userDetails: UserDetails
  accessToken: string | null
  redirectUrl: string | null
  login: (userDetails: UserDetails, token: string) => void
  logout: () => void
  checkAuthStatus: () => void
  isTokenValid: () => boolean
  setRedirectUrl: (url: string) => void
  clearRedirectUrl: () => void
}

interface JWTPayload {
  exp: number
  [key: string]: unknown
}

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        isLoggedIn: false,
        userDetails: {
          email: '',
          firstName: '',
        },
        accessToken: null,
        redirectUrl: '/',

        login: (userDetails: UserDetails, token: string) => {
          set({
            isLoggedIn: true,
            userDetails,
            accessToken: token,
          })
        },

        logout: () => {
          set({
            isLoggedIn: false,
            userDetails: { email: '', firstName: '' },
            accessToken: null,
          })
          // no longer needed as always tracking redirectUrl regardless of login status
          // get().clearRedirectUrl()
        },

        setRedirectUrl: (url: string) => {
          set({ redirectUrl: url })
        },

        clearRedirectUrl: () => {
          set({ redirectUrl: null })
        },

        checkAuthStatus: () => {
          const { accessToken, userDetails, isTokenValid, logout } = get()

          if (!accessToken || !userDetails.email || !isTokenValid()) {
            logout()
            return
          }
        },

        isTokenValid: () => {
          const token = get().accessToken
          if (!token) return false

          try {
            // JWT expiry check (no signature verification)
            const parts = token.split('.')
            if (parts.length !== 3) {
              console.error('Invalid JWT format')
              return false
            }
            const payload = JSON.parse(atob(parts[1])) as JWTPayload
            const currentTime = Date.now() / 1000
            if (typeof payload.exp !== 'number') {
              console.error('Invalid token: missing or invalid exp claim')
              return false
            }

            return payload.exp > currentTime
          }
          catch (error) {
            console.error('Invalid token format:', error)
            return false
          }
        },
      }),

      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        // Only persist essential data
        partialize: state => ({
          isLoggedIn: state.isLoggedIn,
          userDetails: state.userDetails,
          accessToken: state.accessToken,
          redirectUrl: state.redirectUrl,
        }),
      },
    ),
    {
      name: 'AuthStore', // Name that appears in Redux DevTools
      enabled: process.env.NODE_ENV === 'development', // Only enable in development
    },
  ),
)

export default useAuthStore
