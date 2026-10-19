import axios from 'axios';

// Change this base URL once your FastAPI / Backend is running
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const cropService = {
  async getAllCrops() {
    // Later: return axios.get(`${API_BASE_URL}/crops`)
    // For now: Mock data matching your workflow requirements
    return [
      { id: 1, name: 'Rice', season: 'Monsoon', fertilizer: 'Urea' },
      { id: 2, name: 'Corn', season: 'Summer', fertilizer: 'DAP' }
    ];
  },

  async createCrop(cropData) {
    // Later: return axios.post(`${API_BASE_URL}/crops`, cropData)
    console.log('Saving to database simulation:', cropData);
    return { success: true, data: cropData };
  }
};