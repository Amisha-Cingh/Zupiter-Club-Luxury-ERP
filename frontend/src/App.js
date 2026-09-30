import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';

// Simple Dashboard Placeholder (Agli stage me hum isko poora ERP Dashboard banayenge)
const DashboardPlaceholder = () => {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Welcome to Hospitality Club Dashboard</h1>
        <p className="text-sm text-slate-400 mb-4">Role: <span className="text-emerald-400 font-semibold">{user?.role}</span> | Phone: {user?.phone}</p>
        <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold">
          Logout
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;