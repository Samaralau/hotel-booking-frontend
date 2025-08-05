import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ToastStore {
  toastMsg: string
  toastType: 'success' | 'error' | 'info'
  toastTimeoutId: NodeJS.Timeout | null
  setToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

const useToastStore = create<ToastStore>()(
  devtools(
    (set, get) => ({
      toastMsg: '',
      toastType: 'info',
      toastTimeoutId: null,

      setToast: (
        message: string,
        type: 'success' | 'error' | 'info' = 'info',
      ) => {
        const { toastTimeoutId } = get()

        // Clear existing timeout
        // prevent memory leaks: https://lucumr.pocoo.org/2024/6/5/node-timeout/
        if (toastTimeoutId) {
          clearTimeout(toastTimeoutId)
        }

        // Set new toast
        const newTimeoutId = setTimeout(() => {
          get().clearToast()
        }, 3000)

        set({
          toastMsg: message,
          toastType: type,
          toastTimeoutId: newTimeoutId,
        })
      },

      clearToast: () => {
        const { toastTimeoutId } = get()
        if (toastTimeoutId) {
          clearTimeout(toastTimeoutId)
        }
        set({
          toastMsg: '',
          toastType: 'info',
          toastTimeoutId: null,
        })
      },
    }),
    {
      name: 'ToastStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
)

export default useToastStore
