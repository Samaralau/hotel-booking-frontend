export interface AuthResponse {
  success: boolean
  data: {
    firstName: string
    email: string
    isAdmin: boolean
    token: string
  }
  error?: { message?: string }
  message: string
}

type ZodIssue = { message: string }

export function getErrorMessage(errorResponse: AuthResponse): string {
  const message = errorResponse?.error?.message

  try {
    const parsed: unknown = JSON.parse(message ?? '')
    if (Array.isArray(parsed)) {
      return (parsed as ZodIssue[])
        .map(err => typeof err.message === 'string' ? err.message : '')
        .join(' | ')
    }
  }
  catch {
    // silently ignore parse errors
  }

  return errorResponse?.message || 'Something went wrong'
}
