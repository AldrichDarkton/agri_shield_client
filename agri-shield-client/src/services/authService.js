import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const authService = {
  async login(email, password) {
    // -------------------------------------------------------------
    // FUTURE BACKEND INTEGRATION:
    // const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    // return response.data; // e.g., { token: '...', user: { name: '...', role: 'admin' } }
    // -------------------------------------------------------------

    // SIMULATED MOCK LOGIN:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@agrishield.com' && password === 'admin123') {
          resolve({
            user: { id: 1, name: 'Admin User', email, role: 'admin' },
            token: 'mock-admin-jwt-token',
          });
        } else if (email === 'user@agrishield.com' && password === 'user123') {
          resolve({
            user: { id: 2, name: 'Farmer John', email, role: 'user' },
            token: 'mock-user-jwt-token',
          });
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 800); // Simulated delay
    });
  },

  async logout() {
    localStorage.removeItem('agri_shield_token');
    localStorage.removeItem('agri_shield_user');
  }
};