import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Custom Private Route component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <nav className="bg-white shadow-sm py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-8 items-center cursor-pointer">
                <div className="text-2xl font-black text-indigo-600 tracking-tight">PrimeTrade</div>
              </div>
            </div>
          </nav>

          <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
