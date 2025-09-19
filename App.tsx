
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { ResumeBuilder } from './components/ResumeBuilder';
import { AdminPage } from './components/AdminPage';
import { LoadingSpinner } from './components/icons/LoadingSpinner';

// A simple component to handle routing after authentication
const AuthenticatedApp = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<'builder' | 'admin'>('builder');

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-100">
        <header className="bg-white shadow-md p-4 sticky top-0 z-30 no-print">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <h1 className="text-2xl font-bold text-zinc-900">Resume Builder</h1>
                     <div className="h-6 w-px bg-zinc-300 hidden sm:block"></div>
                     <div className="hidden sm:flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage('builder')} 
                            className={`text-sm font-semibold p-2 rounded-md ${currentPage === 'builder' ? 'bg-blue-100 text-blue-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                        >
                            Editor
                        </button>
                        {isAdmin && (
                            <button 
                                onClick={() => setCurrentPage('admin')} 
                                className={`text-sm font-semibold p-2 rounded-md ${currentPage === 'admin' ? 'bg-blue-100 text-blue-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                            >
                                Admin Dashboard
                            </button>
                        )}
                     </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-600 hidden sm:inline">Welcome, {user?.email}</span>
                    <button 
                        onClick={logout}
                        className="bg-zinc-200 text-zinc-800 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-300 transition-colors text-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </header>
        
        <main>
            {currentPage === 'builder' && <ResumeBuilder />}
            {currentPage === 'admin' && isAdmin && <AdminPage />}
        </main>
    </div>
  );
}


// The main component that decides what to show based on auth state
const AppContent = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner />
                    <span className="text-lg font-medium text-zinc-800">Loading...</span>
                 </div>
            </div>
        )
    }

    return user ? <AuthenticatedApp /> : <LoginPage />;
}

// The root App component that wraps everything with the provider
function App() {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
}

export default App;
