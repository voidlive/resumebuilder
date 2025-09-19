
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-zinc-900 mb-6">Resume Builder Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border rounded-md bg-zinc-100 border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border rounded-md bg-zinc-100 border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholder="password123"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoggingIn ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
         <div className="mt-6 text-center text-sm text-zinc-600 border-t pt-4">
            <p className="font-semibold">Demo Accounts:</p>
            <p>Admin: akhillsai11@gmail.com / akhilsai</p>
            <p>User: user@example.com / password123</p>
            <p className="mt-4 text-xs text-red-600 font-semibold">NOTE: User creation is not available. This is a demo with a pre-configured user list.</p>
        </div>
      </div>
    </div>
  );
};