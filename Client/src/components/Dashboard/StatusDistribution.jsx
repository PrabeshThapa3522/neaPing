import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusDistribution = ({ data }) => {
  const chartData = {
    labels: ['Up', 'Issues', 'Down'],
    datasets: [
      {
        data: [data.online, data.issues, data.offline],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(231, 76, 60, 0.8)',
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(231, 76, 60, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
  };

  const total = data.online + data.issues + data.offline;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        No data
      </div>
    );
  }

  return (
    <div className="h-48 relative">
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
      </div>
    </div>
  );
};

StatusDistribution.propTypes = {
  data: PropTypes.shape({
    online: PropTypes.number.isRequired,
    issues: PropTypes.number.isRequired,
    offline: PropTypes.number.isRequired
  }).isRequired
};

export default StatusDistribution;