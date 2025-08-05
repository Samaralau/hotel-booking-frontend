export const getToastStyles = (type: string) => {
  switch (type) {
    case 'error':
      return 'alert-error'
    case 'success':
      return 'alert-success'
    case 'info':
    default:
      return 'alert-info'
  }
}
