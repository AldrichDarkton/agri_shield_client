import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { Users, Sprout, TestTube, LogOut, Plus, Trash2, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  // Tab State: 'users' | 'crops' | 'fertilizers'
  const [activeTab, setActiveTab] = useState('users');

  // Data States
  const [users, setUsers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);

  // Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const uData = await adminService.getUsers();
    const cData = await adminService.getCrops();
    const fData = await adminService.getFertilizers();
    setUsers(uData);
    setCrops(cData);
    setFertilizers(fData);
  };

  // Handle Dynamic Creation
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'users') {
      await adminService.createUser({ ...formData, role: formData.role || 'user' });
    } else if (activeTab === 'crops') {
      await adminService.createCrop(formData);
    } else if (activeTab === 'fertilizers') {
      await adminService.createFertilizer(formData);
    }
    
    setFormData({});
    setIsModalOpen(false);
    loadDashboardData();
  };

  // Handle Deletion
  const handleDelete = async (id) => {
    if (activeTab === 'users') await adminService.deleteUser(id);
    if (activeTab === 'crops') await adminService.deleteCrop(id);
    if (activeTab === 'fertilizers') await adminService.deleteFertilizer(id);
    loadDashboardData();
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 shadow-md px-6 justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl text-primary">AgriShield Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-base-content/70">Welcome, <strong>{user?.name}</strong></span>
          <button onClick={logout} className="btn btn-outline btn-error btn-sm gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Stat Cards (View Totals) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActiveTab('users')} 
            className={`stat bg-base-100 shadow rounded-box cursor-pointer border-2 transition-all ${activeTab === 'users' ? 'border-primary' : 'border-transparent'}`}
          >
            <div className="stat-figure text-primary"><Users className="w-8 h-8" /></div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{users.length}</div>
            <div className="stat-desc">Click to manage users</div>
          </div>

          <div 
            onClick={() => setActiveTab('crops')} 
            className={`stat bg-base-100 shadow rounded-box cursor-pointer border-2 transition-all ${activeTab === 'crops' ? 'border-primary' : 'border-transparent'}`}
          >
            <div className="stat-figure text-accent"><Sprout className="w-8 h-8" /></div>
            <div className="stat-title">Total Crops</div>
            <div className="stat-value text-accent">{crops.length}</div>
            <div className="stat-desc">Click to manage crops</div>
          </div>

          <div 
            onClick={() => setActiveTab('fertilizers')} 
            className={`stat bg-base-100 shadow rounded-box cursor-pointer border-2 transition-all ${activeTab === 'fertilizers' ? 'border-primary' : 'border-transparent'}`}
          >
            <div className="stat-figure text-secondary"><TestTube className="w-8 h-8" /></div>
            <div className="stat-title">Total Fertilizers</div>
            <div className="stat-value text-secondary">{fertilizers.length}</div>
            <div className="stat-desc">Click to manage fertilizers</div>
          </div>
        </div>

        {/* Dynamic Data Table Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            
            {/* Table Header Controls */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-2xl capitalize">
                Manage {activeTab}
              </h2>
              <button 
                onClick={() => { setFormData({}); setIsModalOpen(true); }}
                className="btn btn-primary btn-sm gap-2"
              >
                <Plus className="w-4 h-4" /> Add New {activeTab.slice(0, -1)}
              </button>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>ID</th>
                    {activeTab === 'users' && <><th>Name</th><th>Email</th><th>Role</th></>}
                    {activeTab === 'crops' && <><th>Crop Name</th><th>Season</th><th>Category</th></>}
                    {activeTab === 'fertilizers' && <><th>Fertilizer Name</th><th>Type</th><th>Quantity</th></>}
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'users' && users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="font-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>{u.role}</span></td>
                      <td className="text-right">
                        <button onClick={() => handleDelete(u.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'crops' && crops.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td className="font-semibold">{c.name}</td>
                      <td>{c.season}</td>
                      <td><span className="badge badge-accent">{c.category}</span></td>
                      <td className="text-right">
                        <button onClick={() => handleDelete(c.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'fertilizers' && fertilizers.map(f => (
                    <tr key={f.id}>
                      <td>{f.id}</td>
                      <td className="font-semibold">{f.name}</td>
                      <td>{f.type}</td>
                      <td>{f.quantity}</td>
                      <td className="text-right">
                        <button onClick={() => handleDelete(f.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

      {/* Dynamic Create Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg capitalize mb-4">Create {activeTab.slice(0, -1)}</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Common / Dynamic Inputs */}
              <div className="form-control">
                <label className="label"><span className="label-text">Name</span></label>
                <input 
                  type="text" 
                  required 
                  className="input input-bordered"
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {activeTab === 'users' && (
                <div className="form-control">
                  <label className="label"><span className="label-text">Email</span></label>
                  <input 
                    type="email" 
                    required 
                    className="input input-bordered"
                    value={formData.email || ''} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              )}

              {activeTab === 'crops' && (
                <>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Season</span></label>
                    <input 
                      type="text" 
                      required 
                      className="input input-bordered"
                      value={formData.season || ''} 
                      onChange={(e) => setFormData({...formData, season: e.target.value})}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Category</span></label>
                    <input 
                      type="text" 
                      required 
                      className="input input-bordered"
                      value={formData.category || ''} 
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                </>
              )}

              {activeTab === 'fertilizers' && (
                <>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Type</span></label>
                    <input 
                      type="text" 
                      required 
                      className="input input-bordered"
                      value={formData.type || ''} 
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Quantity</span></label>
                    <input 
                      type="text" 
                      required 
                      className="input input-bordered"
                      value={formData.quantity || ''} 
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="modal-action">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}