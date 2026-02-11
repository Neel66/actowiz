import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './components/Auth/login';
import Register from './components/Auth/register';
import NotFound from './components/pages/NotFound';
import UserDashboard from './components/user/dashboard/Dashboard';
import BugCreatorDashboard from './components/bug-creator/dashboard/Dashboard';
import { getRoleFromToken } from './utils/jwt';

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = getRoleFromToken(token);
      if (role === 'user') {
        navigate('/user-dashboard');
      } else if (role === 'bug-creator') {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/dashboard" element={<BugCreatorDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
