// Mock Database Records
let mockHistory = {
  crop: [
    { id: 1, name: 'Rice', date: '2026-10-10', status: 'Healthy' },
    { id: 2, name: 'Wheat', date: '2026-10-12', status: 'Diseased (Rust)' },
  ],
  pesticide: [
    { id: 1, name: 'Neem Oil Spray', crop: 'Rice', target: 'Aphids' },
    { id: 2, name: 'Copper Fungicide', crop: 'Wheat', target: 'Rust' },
  ],
  fertilizer: [
    { id: 1, name: 'Urea (N)', dosage: '50kg/acre', recommendedFor: 'Nitrogen Deficiency' },
    { id: 2, name: 'DAP (P)', dosage: '30kg/acre', recommendedFor: 'Root Enhancement' },
  ],
};

export const userService = {
  // Simulate Disease Detection ML API (FastAPI)
  async analyzeCropImage(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly simulate disease detection for demo
        const isDiseased = Math.random() > 0.3;
        if (isDiseased) {
          resolve({
            detected: true,
            diseaseName: 'Leaf Blight (Fungal)',
            confidence: '94%',
            recommendedFertilizer: 'Potash (K2O) - 25kg/acre',
            recommendedPesticide: 'Mancozeb 75% WP Fungicide',
          });
        } else {
          resolve({
            detected: false,
            message: 'No crop disease detected. Crop appears healthy!',
          });
        }
      }, 1500);
    });
  },

  // Fetch History from Database
  async getHistory() {
    return { ...mockHistory };
  },
};