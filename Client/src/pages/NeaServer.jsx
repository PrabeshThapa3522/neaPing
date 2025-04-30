import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, Plus, Info, RefreshCcw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ServerForm from '../components/NeaServer/ServerForm';
import ServerItem from '../components/NeaServer/ServerItem';

const NeaServer = () => {
  const { provinceId } = useParams();

  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    up: 0,
    issues: 0,
    down: 0
  });
  const [provinceName, setProvinceName] = useState('');

  useEffect(() => {
    fetchServers();
    const provinceNames = [
      'Koshi Province',
      'Madhesh Province',
      'Bagmati Province',
      'Gandaki Province',
      'Lumbini Province',
      'Karnali Province',
      'Sudurpashchim Province'
    ];
    const index = parseInt(provinceId || '1') - 1;
    setProvinceName(provinceNames[index] || 'Province');
  }, [provinceId]);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/servers/province/${provinceId}`);
      setServers(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const up = response.data.filter((s) => s.status === 'online').length;

      const issues = response.data.filter((s) => s.status === 'issues').length;
      const down = response.data.filter((s) => s.status === 'offline').length;
      
      setStats({ total, up, issues, down });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching servers:', error);
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      await api.post(`/api/servers/refresh/province/${provinceId}`);
      await fetchServers();
    } catch (error) {
      console.error('Error refreshing servers:', error);
      setLoading(false);
    }
  };

  const handleAddServer = async (serverData) => {
    try {
      await api.post('/api/servers', { ...serverData, provinceId });
      setShowAddForm(false);
      fetchServers();
    } catch (error) {
      console.error('Error adding server:', error);
    }
  };

  const handleDeleteServer = async (serverId) => {
    try {
      await api.delete(`/api/servers/${serverId}`);
      setServers(servers.filter(server => server._id !== serverId));
      fetchServers();
    } catch (error) {
      console.error('Error deleting server:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
          {provinceName} NEA Server
        </h1>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
            onClick={refreshAll}
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <>
                <X className="h-5 w-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add Website
              </>
            )}
          </motion.button>
        </div>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-800 rounded-lg p-6 mb-6"
        >
          <ServerForm onSubmit={handleAddServer} onCancel={() => setShowAddForm(false)} />
        </motion.div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-400">
            {stats.total} sites • {stats.up} up • {stats.issues} issues • {stats.down} down
          </div>
          <div className="text-sm text-gray-400">
            Last Checked: {loading ? 'Checking...' : new Date().toLocaleString()}
          </div>
        </div>

        {loading && servers.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : servers.length > 0 ? (
          <motion.div
            className="divide-y divide-gray-700"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {servers.map(server => (
              <motion.div key={server._id} variants={itemVariants}>
                <ServerItem 
                  server={server} 
                  onDelete={() => handleDeleteServer(server._id)}
                  onRefresh={fetchServers}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No servers added for this province</p>
            <p className="text-sm mt-2">Click the "Add Website" button to add a server to monitor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeaServer;
