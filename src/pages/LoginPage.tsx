import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAuth } from '../hooks/useAuth'
import type { ErrorResponse } from '../types'

export function LoginPage() {
  useDocumentTitle('Login')
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/dashboard'

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, 'Unable to log in.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md border border-gray-200 bg-white">
        <div className="bg-ci-blue-950 px-6 py-5 text-white">
          <h1 className="text-xl font-semibold">ConstructIQ Login</h1>
          <p className="mt-1 text-sm text-blue-100">Unified authentication entry</p>
        </div>
        <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              className="mt-1 h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
              placeholder="user@example.com"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              className="mt-1 h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
              placeholder="Enter password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {errorMessage ? (
            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-ci-red-700">
              {errorMessage}
            </div>
          ) : null}
          <button
            className="h-10 w-full bg-ci-blue-800 text-sm font-semibold text-white hover:bg-ci-blue-900 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center text-sm text-gray-500">
            No account yet?
            <Link className="ml-1 text-ci-blue-800" to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data.message ?? fallback
  }

  return fallback
}
