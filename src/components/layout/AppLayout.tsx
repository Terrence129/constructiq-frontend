import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard', label: 'Executive Dashboard' },
  { to: '/projects', label: 'Project Registry' },
  { to: '/ai-analysis', label: 'AI Analysis' },
]

export function AppLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed inset-x-0 top-0 z-20 h-14 border-b border-blue-950 bg-ci-blue-950 text-white shadow">
        <div className="flex h-full items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center bg-ci-red-700 text-sm font-bold">
              CI
            </div>
            <div>
              <div className="text-base font-semibold">
                ConstructIQ Project Management Platform
              </div>
              <div className="text-xs text-blue-100">
                Full-cycle construction project control system
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-xs text-blue-100 md:flex">
            <span>Environment: Development</span>
            <span>Current User: {user?.name ?? 'Authenticated User'}</span>
            <button
              className="border border-blue-200 px-3 py-1 text-xs font-medium text-white hover:bg-ci-blue-800"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-14 z-10 hidden w-56 border-r border-gray-200 bg-white md:block">
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="text-xs font-semibold text-gray-500">
            Business Navigation
          </div>
          <div className="mt-1 h-0.5 w-10 bg-ci-gold-500" />
        </div>
        <nav className="p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `mb-1 block border-l-4 px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'border-l-ci-red-700 bg-blue-50 text-ci-blue-950'
                    : 'border-l-transparent text-gray-700 hover:bg-gray-50 hover:text-ci-blue-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="pt-14 md:pl-56">
        <Outlet />
      </main>
    </div>
  )
}
