import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Factory, ShieldCheck, History, Settings, ExternalLink, Wallet, Menu, X } from 'lucide-react';
import '../styles/Layout.css';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggle}></div>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon"></div>
          <span>SUPPLY<span>CHAIN</span></span>
          <button className="mobile-close-btn" onClick={toggle}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/manufacturer" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={toggle}>
            <Factory size={20} />
            <span>Manufacturer</span>
          </NavLink>
          
          <NavLink to="/stakeholder" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={toggle}>
            <ShieldCheck size={20} />
            <span>Stakeholder</span>
          </NavLink>
          
          <NavLink to="/audit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={toggle}>
            <History size={20} />
            <span>Audit Log</span>
          </NavLink>

          <NavLink to="/verify" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={toggle}>
            <ExternalLink size={20} />
            <span>Consumer Portal</span>
          </NavLink>

          <div className="nav-divider"></div>
          
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={toggle}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <div className="status-indicator">
            <div className="pulse"></div>
            <span>On-Chain Syncing</span>
          </div>
        </div>
      </div>
    </>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>('0x123...abc');

  const connectWallet = () => {
    // Simulate connection
    setWalletAddress('0x71C765...d897');
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="header-search">
          <input type="text" placeholder="Search Blockchain ID..." />
        </div>
      </div>
      <div className="header-actions">
        {walletAddress ? (
          <div className="wallet-info" onClick={disconnectWallet} title="Click to disconnect (simulated)">
            <span className="wallet-label">Wallet</span>
            <span className="wallet-address">{walletAddress}</span>
          </div>
        ) : (
          <button className="connect-wallet-btn" onClick={connectWallet} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            <Wallet size={16} />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};
