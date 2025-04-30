import { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatusCard from '../components/Dashboard/StatusCard';
import StatusDistribution from '../components/Dashboard/StatusDistribution';

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('Never');
  const [stats, setStats] = useState({
    online: 0,
    issues: 0,
    offline: 0
  });

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/servers');
      setServers(response.data);
      
      // Calculate stats
      const online = response.data.filter((server) => server.status === 'online').length;
      const issues = response.data.filter((server) => server.status === 'issues').length;
      const offline = response.data.filter((server) => server.status === 'offline').length;
      
      setStats({ online, issues, offline });
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching servers:', error);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container mx-auto  bg-black px-4 mt-10 rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Activity className="mr-2 text-blue-500" />
          Server Status Dashboard
          <span className="ml-auto text-base font-normal text-gray-400">
            {new Date().toLocaleTimeString()}
          </span>
        </h1>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center">
              <Clock className="mr-2 text-gray-400" />
              Status Distribution
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <StatusDistribution data={stats} />
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center">
              <Activity className="mr-2 text-gray-400" />
              System Status
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <StatusCard 
                  icon={<CheckCircle className="text-green-500" />} 
                  label="Online" 
                  count={stats.online}
                  color="bg-green-500/10"
                />
                <StatusCard 
                  icon={<AlertTriangle className="text-yellow-500" />} 
                  label="Issues" 
                  count={stats.issues}
                  color="bg-yellow-500/10"
                />
                <StatusCard 
                  icon={<XCircle className="text-red-500" />} 
                  label="Offline" 
                  count={stats.offline}
                  color="bg-red-500/10"
                />
                <div className="text-gray-400 text-sm mt-4">
                  Last update: {lastUpdated}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center">
              <AlertTriangle className="mr-2 text-gray-400" />
              Sites with Issues
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div>
                {servers.filter(server => server.status !== 'online').length > 0 ? (
                  <div className="space-y-3">
                    {servers
                      .filter(server => server.status !== 'online')
                      .map((server) => (
                        <div key={server._id} className="bg-gray-700/50 p-3 rounded-lg flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            server.status === 'issues' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{server.name}</div>
                            <div className="text-sm text-gray-400">{server.url}</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">
                            {server.status === 'issues' ? 'Warning' : 'Down'}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    All systems operational
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
