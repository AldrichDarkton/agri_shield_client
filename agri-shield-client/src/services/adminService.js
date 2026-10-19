// Initial Mock Database State
let mockUsers = [
  { id: 1, name: 'Farmer John', email: 'user@agrishield.com', role: 'user' },
  { id: 2, name: 'Admin Mary', email: 'admin@agrishield.com', role: 'admin' },
];

let mockCrops = [
  { id: 1, name: 'Rice', season: 'Monsoon', category: 'Cereal' },
  { id: 2, name: 'Wheat', season: 'Winter', category: 'Cereal' },
];

let mockFertilizers = [
  { id: 1, name: 'Urea', type: 'Nitrogenous', quantity: '500 kg' },
  { id: 2, name: 'DAP', type: 'Phosphatic', quantity: '300 kg' },
];

export const adminService = {
  // --- USERS ---
  async getUsers() { return [...mockUsers]; },
  async createUser(data) {
    const newUser = { id: Date.now(), ...data };
    mockUsers.push(newUser);
    return newUser;
  },
  async deleteUser(id) {
    mockUsers = mockUsers.filter(u => u.id !== id);
    return true;
  },

  // --- CROPS ---
  async getCrops() { return [...mockCrops]; },
  async createCrop(data) {
    const newCrop = { id: Date.now(), ...data };
    mockCrops.push(newCrop);
    return newCrop;
  },
  async deleteCrop(id) {
    mockCrops = mockCrops.filter(c => c.id !== id);
    return true;
  },

  // --- FERTILIZERS ---
  async getFertilizers() { return [...mockFertilizers]; },
  async createFertilizer(data) {
    const newFertilizer = { id: Date.now(), ...data };
    mockFertilizers.push(newFertilizer);
    return newFertilizer;
  },
  async deleteFertilizer(id) {
    mockFertilizers = mockFertilizers.filter(f => f.id !== id);
    return true;
  }
};