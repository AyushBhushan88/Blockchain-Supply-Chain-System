import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import axios from 'axios';
import { Shield, BarChart3, Globe, List } from 'lucide-react';
import '../styles/StakeholderDashboard.css';

const SupplyChainCanvas = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#00d2ff" wireframe opacity={0.2} transparent />
      </mesh>
      
      {/* Visualizing Supply Chain Nodes as glowing spheres */}
      {[[-2, 0, 0], [0, 1, 0], [2, 0, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#39ff14" />
          <pointLight color="#39ff14" intensity={0.5} distance={2} />
        </mesh>
      ))}
    </>
  );
};

const StakeholderDashboard = () => {
  const [stats, setStats] = useState({ total: 0, inTransit: 0, sold: 0 });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
        
        const total = response.data.length;
        const inTransit = response.data.filter((p: any) => p.status.includes('TRANSIT')).length;
        const sold = response.data.filter((p: any) => p.status === 'SOLD').length;
        setStats({ total, inTransit, sold });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Stakeholder Audit Dashboard</h1>
        <p className="subtitle">Global supply chain visibility and integrity verification.</p>
      </div>

      <div className="stats-row">
        <div className="card stat-card">
          <BarChart3 className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Total Units</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="card stat-card">
          <Globe className="stat-icon primary" />
          <div className="stat-content">
            <span className="stat-label">In Global Transit</span>
            <span className="stat-value">{stats.inTransit}</span>
          </div>
        </div>
        <div className="card stat-card">
          <Shield className="stat-icon secondary" />
          <div className="stat-content">
            <span className="stat-label">Verified Authentic</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid stakeholder-grid">
        <div className="card map-card">
          <div className="card-header">
            <Globe size={20} />
            <h2>Live Supply Chain Network</h2>
          </div>
          <div className="three-map-container">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <SupplyChainCanvas />
              <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
            </Canvas>
          </div>
        </div>

        <div className="card list-card">
          <div className="card-header">
            <List size={20} />
            <h2>Full Chain of Custody</h2>
          </div>
          <div className="audit-list">
             <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Current Owner</th>
                    <th>Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id}>
                      <td className="mono">#{p.blockchainId}</td>
                      <td className="address">{p.currentOwner}</td>
                      <td className="timestamp">{new Date(p.lastUpdated).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderDashboard;
