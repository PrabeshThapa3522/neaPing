import { useState } from 'react';
import { RefreshCw, Trash2, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const ServerItem = ({ server, onDelete, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRefresh = async (e) => {
    e.stopPropagation();
    try {
      setIsRefreshing(true);
      await api.post(`/api/servers/${server._id}/refresh`);
      onRefresh();
    } catch (error) {
      console.error('Error refreshing server:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    issues: 'bg-yellow-500',
  }[server.status] || 'bg-gray-500';

  const formattedDate = server.lastChecked
    ? new Date(server.lastChecked).toLocaleString()
    : 'Never';

  return (
    <div className="py-4">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="mr-3">
          <div className={`h-3 w-3 rounded-full ${statusColor}`}></div>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">{server.name || server.url}</div>
          <div className="text-gray-400 text-sm">{server.url}</div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-400 hover:text-blue-500 focus:outline-none"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-400 hover:text-red-500 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 ${showDetails ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'} focus:outline-none`}
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
          >
            <Info className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 ml-6 bg-gray-700/50 p-4 rounded-lg"
        >
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-gray-400">Last Checked:</div>
            <div className="text-white">{formattedDate}</div>

            <div className="text-gray-400">Packet Loss:</div>
            <div className="text-white">{server.packetLoss}%</div>

            <div className="text-gray-400">Response Time:</div>
            <div className="text-white">
              {server.responseTime !== null ? `${server.responseTime} ms` : 'null ms'}
            </div>

            <div className="text-gray-400">Status:</div>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full ${statusColor} mr-2`}></div>
              <span className="capitalize text-white">{server.status}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ServerItem;
