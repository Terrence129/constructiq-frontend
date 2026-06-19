import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../api/userApi'
import type { User } from '../../types'

interface UserSearchSelectProps {
  excludedUserIds?: number[]
  onSelect: (user: User) => void
  selectedUser: User | null
}

export function UserSearchSelect({
  excludedUserIds = [],
  onSelect,
  selectedUser,
}: UserSearchSelectProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const queryParams = useMemo(
    () => ({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
    }),
    [email, name],
  )

  const {
    data: users = [],
    error,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => getUsers(queryParams),
  })

  const visibleUsers = users.filter(
    (user) =>
      !excludedUserIds.includes(user.id) || selectedUser?.id === user.id,
  )

  return (
    <div className="border border-gray-200">
      <div className="grid gap-3 border-b border-gray-200 bg-gray-50 p-3 md:grid-cols-2">
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          placeholder="Search by name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="h-9 border border-gray-300 px-3 outline-none focus:border-ci-blue-800"
          placeholder="Search by email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      {selectedUser ? (
        <div className="border-b border-blue-100 bg-blue-50 px-3 py-2 text-sm">
          <span className="font-semibold text-gray-900">Selected: </span>
          <span className="text-gray-700">
            {selectedUser.name} ({selectedUser.email})
          </span>
        </div>
      ) : null}

      {isFetching ? (
        <div className="px-3 py-3 text-sm text-gray-500">Loading users...</div>
      ) : null}
      {isError ? (
        <div className="px-3 py-3 text-sm text-ci-red-700">
          {error instanceof Error ? error.message : 'Unable to load users.'}
        </div>
      ) : null}
      {!isFetching && !isError && visibleUsers.length === 0 ? (
        <div className="px-3 py-3 text-sm text-gray-500">
          No users match the current filters.
        </div>
      ) : null}
      {!isFetching && !isError && visibleUsers.length > 0 ? (
        <div className="max-h-64 overflow-y-auto">
          {visibleUsers.map((user) => (
            <button
              className={`flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left text-sm hover:bg-blue-50 ${
                selectedUser?.id === user.id ? 'bg-blue-50' : 'bg-white'
              }`}
              key={user.id}
              onClick={() => onSelect(user)}
              type="button"
            >
              <span>
                <span className="block font-medium text-gray-900">
                  {user.name}
                </span>
                <span className="block text-xs text-gray-500">{user.email}</span>
              </span>
              <span className="text-xs font-semibold text-ci-blue-800">
                {selectedUser?.id === user.id ? 'Selected' : 'Select'}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
