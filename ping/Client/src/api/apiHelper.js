import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001/api/auth' });


export const loginUser = async (data) => {
    try {
      const response = await api.post('/login', data);
      return response;
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };
  
  export const signupUser = async (data) => {
    try {
      const response = await api.post('/register', data);
      return response;
    } catch (error) {
      // Forward the server's error message
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };


export const createMeeting = (data) => axios.post('http://localhost:5001/api/ip', data); 
export const updateMeeting = (id, data) => axios.put(`http://localhost:5001/api/ip/${id}`, data); 
export const deleteMeeting = (id) => axios.delete(`http://localhost:5001/api/ip/${id}`); 
