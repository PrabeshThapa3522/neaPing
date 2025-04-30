import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500 mb-4">Access Denied</p>
          <Navigate to="/login" />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
