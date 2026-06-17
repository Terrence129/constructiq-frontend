import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAuth } from '../hooks/useAuth'
import type { ErrorResponse } from '../types'

export function RegisterPage() {
  useDocumentTitle('Register')
  const navigate = useNavigate()
  const { isAuthenticated, register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      await register({ name, email, password })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, 'Unable to register.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md border border-gray-200 bg-white">
        <div className="bg-ci-blue-950 px-6 py-5 text-white">
          <h1 className="text-xl font-semibold">ConstructIQ Register</h1>
          <p className="mt-1 text-sm text-blue-100">Project team account request</p>
        </div>
        <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              className="mt-1 h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              className="mt-1 h-10 w-full border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
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
              minLength={8}
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
            {isLoading ? 'Registering...' : 'Submit Registration'}
          </button>
          <div className="text-center text-sm text-gray-500">
            Already have an account?
            <Link className="ml-1 text-ci-blue-800" to="/login">
              Login
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
