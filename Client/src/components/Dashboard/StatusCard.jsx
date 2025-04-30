import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const StatusCard = ({ icon, label, count, color }) => {
  return (
    <motion.div 
      className={`p-4 rounded-lg ${color} flex items-center justify-between`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex items-center">
        <div className="mr-3">
          {icon}
        </div>
        <span className="text-lg font-medium text-white">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{count}</div>
    </motion.div>
  );
};

StatusCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};

export default StatusCard;