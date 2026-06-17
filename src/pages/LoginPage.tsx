import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function LoginPage() {
  useDocumentTitle('Login')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md border border-gray-200 bg-white">
        <div className="bg-ci-blue-950 px-6 py-5 text-white">
          <h1 className="text-xl font-semibold">ConstructIQ Login</h1>
          <p className="mt-1 text-sm text-blue-100">Unified authentication entry</p>
        </div>
        <form className="space-y-4 px-6 py-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              className="mt-1 h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
              placeholder="user@example.com"
              type="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              className="mt-1 h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
              placeholder="Enter password"
              type="password"
            />
          </label>
          <button className="h-10 w-full bg-ci-blue-800 text-sm font-semibold text-white hover:bg-ci-blue-900">
            Login
          </button>
          <div className="text-center text-sm text-gray-500">
            No account yet?
            <Link className="text-ci-blue-800" to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
