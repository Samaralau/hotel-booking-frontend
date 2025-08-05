import { Link } from 'wouter'

export const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Link href="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  )
}
