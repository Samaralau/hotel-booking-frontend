import useToastStore from '../../stores/ToastStore'
import { getToastStyles } from '../../utils/ToastStyles'

export const Toast = () => {
  const toastMsg = useToastStore(state => state.toastMsg)
  const toastType = useToastStore(state => state.toastType)

  if (!toastMsg) return null

  return (
    <div
      className={`fixed top-4 right-4 alert ${getToastStyles(toastType)} text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300`}
    >
      {toastMsg}
    </div>
  )
}
