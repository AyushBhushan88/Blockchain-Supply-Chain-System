import React from 'react';
import { NavLink } from 'react-router-dom';
import { Factory, ShieldCheck, History, Settings, ExternalLink } from 'lucide-react';
import '../styles/Layout.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"></div>
        <span>SUPPLY<span>CHAIN</span></span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/manufacturer" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Factory size={20} />
          <span>Manufacturer</span>
        </NavLink>
        
        <NavLink to="/stakeholder" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <ShieldCheck size={20} />
          <span>Stakeholder</span>
        </NavLink>
        
        <NavLink to="/audit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <History size={20} />
          <span>Audit Log</span>
        </NavLink>

        <NavLink to="/verify" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <ExternalLink size={20} />
          <span>Consumer Portal</span>
        </NavLink>

        <div className="nav-divider"></div>
        
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
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
  );
};

const Header = () => {
  return (
    <header className="header">
      <div className="header-search">
        <input type="text" placeholder="Search Blockchain ID or Product Name..." />
      </div>
      <div className="header-actions">
        <div className="wallet-info">
          <span className="wallet-label">Wallet</span>
          <span className="wallet-address">0x123...abc</span>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};
