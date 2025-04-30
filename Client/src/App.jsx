import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NeaServer from './pages/NeaServer';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}> */}
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/province/:provinceId" element={<NeaServer />} />
            <Route path="*" element={<Dashboard />} />
          {/* </Route> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;