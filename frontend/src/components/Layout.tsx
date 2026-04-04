import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Layout.css';

const Header = () => {
  const [wallet, setWallet] = useState<string | null>('0x123...abc');

  return (
    <header className="header">
      <div className="header-logo">
        SYS_OPS_<span>TERMINAL</span>
      </div>
      <div className="wallet-kinetic" onClick={() => setWallet(wallet ? null : '0x71C...d897')}>
        {wallet ? wallet : 'CONNECT_UPLINK'}
      </div>
    </header>
  );
};

const Dock = () => {
  return (
    <nav className="sidebar">
      <NavLink to="/manufacturer" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        [ MINT ]
      </NavLink>
      <NavLink to="/stakeholder" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        [ NODE ]
      </NavLink>
      <NavLink to="/audit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        [ LOG ]
      </NavLink>
      <NavLink to="/verify" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        [ SCAN ]
      </NavLink>
    </nav>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Dock />
    </div>
  );
};
