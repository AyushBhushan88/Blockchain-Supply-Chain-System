import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import StakeholderDashboard from './pages/StakeholderDashboard';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/manufacturer" element={<ManufacturerDashboard />} />
          <Route path="/stakeholder" element={<StakeholderDashboard />} />
          <Route path="/audit" element={<StakeholderDashboard />} /> {/* Reusing for now */}
          <Route path="/" element={<Navigate to="/manufacturer" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
