import React, { useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ProductShowcaseScene } from '../three/ProductShowcaseScene';
import '../styles/ConsumerPortal.css';

interface ProductHistory {
  id: string;
  name: string;
  description: string;
  status: string;
  blockchainId: number;
  history: {
    status: string;
    timestamp: string;
    actor: string;
  }[];
}

const ConsumerPortal = () => {
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState<ProductHistory | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${productId}/history`);
      setProductData(response.data);
    } catch (err) {
      console.error('Verification failed:', err);
      setError(true);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consumer-portal kinetic-reveal">
      <div className="portal-container">
        <div className="portal-header">
          <h1 className="text-spectral">SCAN</h1>
          <p className="subtitle" style={{ marginTop: '2rem' }}>OPTICAL_VERIFICATION_NODE</p>
        </div>

        {!productData ? (
          <div className="origami-panel search-section prism-border">
            <div className="qr-sim-kinetic">
                <div className="qr-scan-line-kinetic"></div>
                <span className="label-kinetic">AWAITING_SPECTRAL_INPUT</span>
            </div>
            
            <form onSubmit={handleVerify} style={{ width: '100%' }}>
              <div className="form-group">
                <label>INPUT_HASH_OR_ID</label>
                <input 
                  type="text" 
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="0X00..." 
                  required 
                />
              </div>
              <button type="submit" className="btn-kinetic" style={{ width: '100%' }}>
                {loading ? 'ANALYZING...' : 'INITIATE_PROVENANCE'}
              </button>
            </form>
            {error && <p className="label-kinetic" style={{ color: 'var(--prism-magenta)', textAlign: 'center' }}>SIGNAL_FAILURE / INVALID_ID</p>}
          </div>
        ) : (
          <div className="reveal-content" style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            <div className="verified-banner-kinetic">
                GENUINE_ASSET_DETECTED
            </div>

            <div className="origami-panel" style={{ padding: 0, height: '500px' }}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                    <ProductShowcaseScene color="#ffffff" />
                    <OrbitControls enableZoom={false} />
                </Canvas>
            </div>

            <div className="origami-panel" style={{ padding: '4rem' }}>
                <h3 style={{ fontSize: '0.7rem', marginBottom: '3rem' }}>SPECTRAL_DATA</h3>
                <div className="data-strip">
                    <span className="label-kinetic">DESIGNATION</span>
                    <span style={{ fontWeight: 900 }}>{productData.name}</span>
                </div>
                <div className="data-strip">
                    <span className="label-kinetic">LEDGER_ID</span>
                    <span style={{ color: 'var(--prism-cyan)' }}>#{productData.blockchainId}</span>
                </div>
                <div className="data-strip" style={{ border: 'none' }}>
                    <span className="label-kinetic">TECHNICAL_SPEC</span>
                    <span style={{ fontSize: '0.7rem', textAlign: 'right', maxWidth: '60%', letterSpacing: '0.1em' }}>{productData.description}</span>
                </div>
            </div>

            <div className="origami-panel" style={{ padding: '4rem' }}>
                <h3 style={{ fontSize: '0.7rem', marginBottom: '3rem' }}>CUSTODY_CHRONOLOGY</h3>
                <div className="timeline">
                    {productData.history.map((event, i) => (
                        <div className="data-strip" key={i}>
                            <span style={{ color: 'var(--prism-magenta)', fontWeight: 900 }}>{event.status}</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>{event.actor}</span>
                            <span style={{ fontWeight: 700 }}>{new Date(event.timestamp).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button className="btn-kinetic" onClick={() => setProductData(null)}>
              RESET_SCANNER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPortal;
