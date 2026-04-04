import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import axios from 'axios';
import { SupplyChainMapScene } from '../three/SupplyChainMapScene';
import '../styles/StakeholderDashboard.css';

interface AuditEntry {
  id: string;
  productId: string;
  action: string;
  timestamp: string;
  actor: string;
}

const StakeholderDashboard = () => {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeVerifications: 0,
    systemTrustScore: 99.9
  });

  useEffect(() => {
    fetchAuditLog();
    fetchStats();
  }, []);

  const fetchAuditLog = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/system/audit');
      setAuditLog(response.data);
    } catch (error) {
      console.error('Error fetching audit log:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setStats(prev => ({ ...prev, totalProducts: response.data.length }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard-container kinetic-reveal">
      <div className="dashboard-header">
        <h1 className="text-spectral">HUB</h1>
        <p className="subtitle">GLOBAL_OVERSIGHT_STATION</p>
      </div>

      <div className="stats-grid">
        <div className="origami-panel spectral-stat prism-border">
            <span className="label-kinetic">TRUST_SCORE</span>
            <span className="value-kinetic text-spectral">{stats.systemTrustScore}</span>
        </div>
        <div className="origami-panel spectral-stat">
            <span className="label-kinetic">LEDGER_SIZE</span>
            <span className="value-kinetic">{stats.totalProducts}</span>
        </div>
        <div className="origami-panel spectral-stat">
            <span className="label-kinetic">NODE_COUNT</span>
            <span className="value-kinetic">12</span>
        </div>
      </div>

      <div className="three-map-origami origami-panel" style={{ padding: 0 }}>
        <div className="preview-label">NETWORK_REFRACTION_MAP</div>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <SupplyChainMapScene />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="origami-panel audit-kinetic">
        <h2 style={{ fontSize: '0.8rem', marginBottom: '4rem' }}>IMMUTABLE_LOG_STREAM</h2>
        <div className="audit-list">
          {auditLog.length === 0 ? (
            <div className="data-strip"><span className="label-mono">STREAM_EMPTY</span></div>
          ) : (
            auditLog.map((entry) => (
              <div className="data-strip" key={entry.id}>
                <span style={{ color: 'var(--prism-cyan)', fontWeight: 900 }}>{entry.action}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>{entry.actor}</span>
                <span style={{ fontWeight: 700 }}>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StakeholderDashboard;
