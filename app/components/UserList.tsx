"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface UserListProps {
  currentSession: Session | null;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  isLoading?: boolean;
}

export function UserList({
  selectedUserId,
  onSelectUser,
  isLoading = false,
}: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-4 text-slate-300">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-600">
        <h2 className="text-white font-semibold">Users</h2>
      </div>
      <div className="divide-y divide-slate-600">
        {users.length === 0 ? (
          <div className="p-4 text-slate-400 text-center">No users available</div>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              disabled={isLoading}
              className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors disabled:opacity-50 ${
                selectedUserId === user.id ? "bg-slate-600 border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="font-medium text-white">{user.name}</div>
              <div className="text-sm text-slate-400">{user.email}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
