import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Server, Activity, LogIn } from 'lucide-react';
import { AuthContext } from '/src/context/AuthContext.jsx'; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-8 md:px-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Server className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2">
            NEA Server Monitor
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Log in to access your dashboard
          </p>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-3 font-medium flex items-center justify-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 flex items-center justify-center">
            <Activity className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-400">
              Server Status Monitoring System
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
