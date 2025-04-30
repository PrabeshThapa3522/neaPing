import { useState } from 'react';
import { motion } from 'framer-motion';

const ServerForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({ url: '' });

  const validateUrl = (value) => {
    if (!value) return 'URL is required';
    if (
      !value.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/) &&
      !value.match(/^(\d{1,3}\.){3}\d{1,3}$/)
    ) {
      return 'Please enter a valid URL or IP address';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlError = validateUrl(url);
    if (urlError) {
      setErrors({ ...errors, url: urlError });
      return;
    }

    onSubmit({
      name: name || url,
      url,
    });

    setName('');
    setUrl('');
    setErrors({ url: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-400 mb-2">
          Display Name (optional)
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., My Website"
          className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="url" className="block text-gray-400 mb-2">
          URL or IP Address
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (errors.url) {
              setErrors({ ...errors, url: validateUrl(e.target.value) });
            }
          }}
          placeholder="e.g., google.com or 8.8.8.8"
          className={`w-full bg-gray-700 border ${
            errors.url ? 'border-red-500' : 'border-gray-600'
          } text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required
        />
        {errors.url && (
          <p className="mt-1 text-red-500 text-sm">{errors.url}</p>
        )}
      </div>
      <div className="flex justify-end space-x-3">
        <motion.button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Website
        </motion.button>
      </div>
    </form>
  );
};

export default ServerForm;
