import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { 
  Sprout, 
  UploadCloud, 
  History, 
  CheckCircle, 
  AlertTriangle, 
  LogOut, 
  TestTube, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export default function UserHomepage() {
  const { user, logout } = useAuth();

  // Image Upload & ML Analysis State
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // History State
  const [history, setHistory] = useState({ crop: [], pesticide: [], fertilizer: [] });
  const [activeHistoryTab, setActiveHistoryTab] = useState('crop');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await userService.getHistory();
    setHistory(data);
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null); // Reset previous analysis
    }
  };

  // Trigger Disease Detection Workflow
  const handleAnalyzeImage = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await userService.analyzeCropImage(selectedImage);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Image analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 shadow-md px-6 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl text-primary">AgriShield Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-base-content/70">
            Welcome, <strong>{user?.name}</strong>
          </span>
          <button onClick={logout} className="btn btn-outline btn-error btn-sm gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* LEFT COLUMN: Recommendation System (Disease Detector) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary flex items-center gap-2 mb-2">
                <ShieldCheck className="w-7 h-7" /> Crop Disease Recommendation System
              </h2>
              <p className="text-sm text-base-content/70 mb-4">
                Upload a clear photo of your crop to inspect for disease symptoms and receive applicable fertilizer and pesticide recommendations.
              </p>

              {/* Upload Dropzone Form */}
              <form onSubmit={handleAnalyzeImage} className="space-y-4">
                <div className="border-2 border-dashed border-base-300 rounded-xl p-6 text-center hover:border-primary transition-colors bg-base-200/50">
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img 
                        src={previewUrl} 
                        alt="Crop Preview" 
                        className="max-h-56 rounded-lg shadow-md object-cover" 
                      />
                      <label className="btn btn-xs btn-ghost text-primary cursor-pointer">
                        Change Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <UploadCloud className="w-12 h-12 text-primary" />
                      <span className="font-semibold text-base-content/80">Click to upload crop image</span>
                      <span className="text-xs text-base-content/50">PNG, JPG, or JPEG</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={!selectedImage || isAnalyzing}
                  className={`btn btn-primary w-full ${isAnalyzing ? 'loading' : ''}`}
                >
                  {isAnalyzing ? 'Detecting Disease...' : 'Detect Crop Disease'}
                </button>
              </form>

              {/* Analysis Results Display */}
              {analysisResult && (
                <div className="mt-6 pt-6 border-t border-base-200 animate-in fade-in duration-300">
                  {analysisResult.detected ? (
                    <div className="alert alert-warning shadow-lg flex flex-col items-start gap-2">
                      <div className="flex items-center gap-2 text-warning-content font-bold text-lg">
                        <AlertTriangle className="w-6 h-6" />
                        Disease Detected: {analysisResult.diseaseName}
                      </div>
                      <p className="text-xs text-warning-content/80">
                        Model Confidence: {analysisResult.confidence}
                      </p>
                      <div className="divider my-1"></div>
                      <div className="w-full bg-base-100 p-4 rounded-lg space-y-2 text-sm text-base-content">
                        <p className="font-semibold text-primary flex items-center gap-1">
                          <TestTube className="w-4 h-4" /> Recommended Fertilizer:
                        </p>
                        <p className="pl-5 text-base-content/80">{analysisResult.recommendedFertilizer}</p>
                        
                        <p className="font-semibold text-secondary flex items-center gap-1 pt-2">
                          <ShieldCheck className="w-4 h-4" /> Recommended Pesticide:
                        </p>
                        <p className="pl-5 text-base-content/80">{analysisResult.recommendedPesticide}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-success text-success-content shadow-lg">
                      <CheckCircle className="w-6 h-6 shrink-0" />
                      <span>{analysisResult.message}</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Database History Views */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center gap-2 mb-2">
                <History className="w-6 h-6 text-secondary" /> Scan & Activity History
              </h2>

              {/* History Tabs */}
              <div className="tabs tabs-boxed mb-4 bg-base-200">
                <button 
                  onClick={() => setActiveHistoryTab('crop')} 
                  className={`tab tab-sm ${activeHistoryTab === 'crop' ? 'tab-active' : ''}`}
                >
                  Crops
                </button>
                <button 
                  onClick={() => setActiveHistoryTab('pesticide')} 
                  className={`tab tab-sm ${activeHistoryTab === 'pesticide' ? 'tab-active' : ''}`}
                >
                  Pesticides
                </button>
                <button 
                  onClick={() => setActiveHistoryTab('fertilizer')} 
                  className={`tab tab-sm ${activeHistoryTab === 'fertilizer' ? 'tab-active' : ''}`}
                >
                  Fertilizers
                </button>
              </div>

              {/* Tab Data Listing */}
              <div className="space-y-3 overflow-y-auto max-h-[420px]">
                {activeHistoryTab === 'crop' && history.crop.map((item) => (
                  <div key={item.id} className="p-3 bg-base-200/60 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-base-content/60">Scanned on: {item.date}</p>
                    </div>
                    <span className={`badge badge-sm ${item.status.includes('Healthy') ? 'badge-success' : 'badge-warning'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}

                {activeHistoryTab === 'pesticide' && history.pesticide.map((item) => (
                  <div key={item.id} className="p-3 bg-base-200/60 rounded-lg space-y-1">
                    <p className="font-semibold text-sm text-secondary">{item.name}</p>
                    <p className="text-xs text-base-content/70">Applied to: <strong>{item.crop}</strong></p>
                    <p className="text-xs text-base-content/60">Target: {item.target}</p>
                  </div>
                ))}

                {activeHistoryTab === 'fertilizer' && history.fertilizer.map((item) => (
                  <div key={item.id} className="p-3 bg-base-200/60 rounded-lg space-y-1">
                    <p className="font-semibold text-sm text-primary">{item.name}</p>
                    <p className="text-xs text-base-content/70">Dosage: <strong>{item.dosage}</strong></p>
                    <p className="text-xs text-base-content/60">Purpose: {item.recommendedFor}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}