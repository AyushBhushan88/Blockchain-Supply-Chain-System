import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import axios from 'axios';
import { DigitalTwinScene } from '../three/DigitalTwinScene';
import { Plus, Package, Send, ExternalLink } from 'lucide-react';
import '../styles/ManufacturerDashboard.css';

interface Product {
  id: string;
  blockchainId: number;
  name: string;
  description: string;
  status: string;
  lastUpdated: string;
}

const ManufacturerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    blockchainId: '',
    initialMetadata: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/products', {
        ...formData,
        blockchainId: parseInt(formData.blockchainId),
        manufacturerAddress: '0x123...abc' // Mock address
      });
      setFormData({ name: '', description: '', blockchainId: '', initialMetadata: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error registering product:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manufacturer Dashboard</h1>
        <p className="subtitle">Register and manage on-chain product twins.</p>
      </div>

      <div className="dashboard-grid">
        {/* Registration Form & 3D Preview */}
        <div className="card registration-card">
          <div className="card-header">
            <Plus size={20} />
            <h2>Register New Product</h2>
          </div>
          
          <div className="registration-content">
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Premium Watch X1" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Blockchain ID (Token ID)</label>
                <input 
                  type="number" 
                  value={formData.blockchainId}
                  onChange={(e) => setFormData({...formData, blockchainId: e.target.value})}
                  placeholder="ID from Smart Contract" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Technical specifications..." 
                  rows={3}
                />
              </div>
              <button type="submit" className="btn-primary submit-btn">
                <Send size={18} />
                Generate Digital Twin
              </button>
            </form>

            <div className="three-preview-container">
              <div className="preview-label">Digital Twin Preview</div>
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                <DigitalTwinScene />
                <OrbitControls enableZoom={false} />
              </Canvas>
              <div className="preview-status">
                <div className="status-dot"></div>
                Ready for Minting
              </div>
            </div>
          </div>
        </div>

        {/* Product Inventory */}
        <div className="card inventory-card">
          <div className="card-header">
            <Package size={20} />
            <h2>Recent Registrations</h2>
          </div>
          
          <div className="inventory-list">
            {loading ? (
              <div className="loading-state">Syncing with Ledger...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">No products registered yet.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Blockchain ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="mono">#{product.blockchainId}</td>
                      <td>{product.name}</td>
                      <td>
                        <span className={`status-pill ${product.status.toLowerCase()}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <button className="icon-btn"><ExternalLink size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
