import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { QrCode, ShieldCheck, ShieldAlert, MapPin, User } from 'lucide-react';
import { ProductShowcaseScene } from '../three/ProductShowcaseScene';
import '../styles/ConsumerPortal.css';

interface ProductHistory {
  status: string;
  actor: string;
  timestamp: string;
  metadata?: string;
}

interface Product {
  blockchainId: number;
  name: string;
  description: string;
  status: string;
  manufacturer: string;
  currentOwner: string;
  lastUpdated: string;
  history: ProductHistory[];
}

const ConsumerPortal = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productId) return;

    setLoading(true);
    setError(false);
    setProduct(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError(true);
      console.error('Verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consumer-portal">
      <div className="portal-container">
        {/* Header */}
        <header className="portal-header">
          <div className="trust-badge">
            <ShieldCheck size={16} />
            <span>Official Ledger Portal</span>
          </div>
          <h1>Verify Authenticity</h1>
          <p>Scan your product's QR code or enter its ID to verify its on-chain history.</p>
        </header>

        {/* Search/Scanner Section */}
        {!product && !error && (
          <div className="search-section card glass">
            <div className="qr-sim">
              <QrCode size={80} className="qr-icon" />
              <div className="qr-scan-line"></div>
            </div>
            
            <form onSubmit={handleVerify} className="verify-form">
              <input 
                type="number" 
                placeholder="Enter Product ID (e.g. 0, 1, 2)" 
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
              <button type="submit" className="btn-primary verify-btn" disabled={loading}>
                {loading ? 'Consulting Ledger...' : 'Verify Product'}
              </button>
            </form>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-card card glass alert">
            <ShieldAlert size={48} className="alert-icon" />
            <h2>Unverified Asset</h2>
            <p>This ID could not be found on the supply chain ledger. Please ensure you have entered the correct ID.</p>
            <button onClick={() => setError(false)} className="btn-secondary">Try Another ID</button>
          </div>
        )}

        {/* Verified Product View */}
        {product && (
          <div className="product-result">
            <div className="verified-banner">
              <ShieldCheck size={24} />
              <span>Authenticity Verified on Blockchain</span>
            </div>

            <div className="result-grid">
              {/* 3D Showcase */}
              <div className="showcase-card card glass">
                <div className="canvas-wrapper">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                    <ProductShowcaseScene color={product.status === 'SOLD' ? '#39ff14' : '#00d2ff'} />
                    <OrbitControls enableZoom={false} autoRotate />
                  </Canvas>
                </div>
                <div className="product-basic-info">
                  <h2>{product.name}</h2>
                  <p className="mono-id">ID: #{product.blockchainId}</p>
                  <p className="desc">{product.description}</p>
                </div>
              </div>

              {/* Provenance Timeline */}
              <div className="provenance-card card glass">
                <h3>Provenance Chain</h3>
                <div className="timeline">
                  {product.history.map((entry, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="status-label">{entry.status.replace(/_/g, ' ')}</span>
                          <span className="timestamp">{new Date(entry.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="timeline-details">
                          <div className="detail-row">
                            <User size={12} />
                            <span className="address-mono">{entry.actor}</span>
                          </div>
                          <div className="detail-row">
                            <MapPin size={12} />
                            <span>Verified Location Cluster</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setProduct(null)} className="btn-secondary reset-btn">Verify Another Product</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPortal;
