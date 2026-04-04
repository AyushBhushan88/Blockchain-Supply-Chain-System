import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import axios from 'axios';
import { DigitalTwinScene } from '../three/DigitalTwinScene';
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
        manufacturerAddress: '0x123...abc'
      });
      setFormData({ name: '', description: '', blockchainId: '', initialMetadata: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error registering product:', error);
    }
  };

  return (
    <div className="dashboard-container kinetic-reveal">
      <div className="dashboard-header">
        <h1 className="text-spectral">MINT</h1>
        <p className="subtitle">AUTHENTIC_ORIGIN_PROTOCOL</p>
      </div>

      <div className="dashboard-grid">
        <div className="origami-panel prism-border" style={{ padding: '4rem' }}>
          <h2 style={{ fontSize: '0.8rem', marginBottom: '4rem' }}>INITIALIZE_SEQUENCE</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ASSET_IDENTIFIER</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="UNDEFINED" 
                required 
              />
            </div>
            <div className="form-group">
              <label>BLOCKCHAIN_TOKEN_ID</label>
              <input 
                type="number" 
                value={formData.blockchainId}
                onChange={(e) => setFormData({...formData, blockchainId: e.target.value})}
                placeholder="0000" 
                required 
              />
            </div>
            <div className="form-group">
              <label>METADATA_SPEC</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="..." 
                rows={2}
              />
            </div>
            <button type="submit" className="btn-kinetic" style={{ width: '100%', marginTop: '2rem' }}>
              GENERATE_TWIN
            </button>
          </form>
        </div>

        <div className="three-preview-container origami-panel" style={{ padding: 0 }}>
            <div className="preview-label">REALTIME_REFRACTION</div>
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 4]} />
              <DigitalTwinScene color="#00f2ff" />
              <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
      </div>

      <div className="origami-panel" style={{ padding: '4rem' }}>
          <h2 style={{ fontSize: '0.8rem', marginBottom: '4rem' }}>RECENT_LEDGER_ENTRIES</h2>
          <div className="inventory-list">
            {loading ? (
              <div className="data-strip"><span className="label-mono">SYNCING_STREAM...</span></div>
            ) : products.length === 0 ? (
              <div className="data-strip"><span className="label-mono">NULL_STATE</span></div>
            ) : (
                products.map((product) => (
                    <div className="data-strip" key={product.id}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <span style={{ color: 'var(--prism-cyan)', fontWeight: 900 }}>#{product.blockchainId}</span>
                            <span style={{ letterSpacing: '0.2em' }}>{product.name}</span>
                        </div>
                        <span style={{ color: 'var(--prism-magenta)', fontSize: '0.7rem', fontWeight: 700 }}>{product.status}</span>
                    </div>
                ))
            )}
          </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
