
import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/get-users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-zinc-800">Admin Dashboard</h2>
       <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Registered Users</h3>
          <p className="text-sm text-zinc-600">This list shows all users with access to the application.</p>
        </div>
        
        {isLoading && (
            <div className="flex justify-center items-center p-16">
                <LoadingSpinner /> <span className="ml-2">Loading users...</span>
            </div>
        )}

        {error && <div className="p-8 text-center text-red-500">Error: {error}</div>}

        {!isLoading && !error && (
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                <tr key={user.email}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};
