import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './header.css';
import Notifications from './Notifications'; // Import the new component

const navLinks = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Request Blood', to: '/request', icon: '🆘' },
  { label: 'Hospitals', to: '/hospitals', icon: '🏥' },
  { label: 'About', to: '/about', icon: 'ℹ️' },
];

export default function UserNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setNavOpen(false);
  };

  const handleNavClick = () => setNavOpen(false);

  return (
    <header className="site-header">
      {navOpen && (
        <div className="nav-backdrop" onClick={() => setNavOpen(false)}></div>
      )}
      <div className="container">
        {/* Logo */}
        <Link
          to="/"
          className="logo"
          onClick={handleNavClick}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <img
            src="/redCrossIcon.png"
            alt="Red Cross Logo"
            style={{ height: 40 }}
          />
          <div className="logo-text">
            <span className="logo-main">LifeShare</span>
            <span className="logo-sub">Lebanon</span>
          </div>
        </Link>

        {/* Modern Animated Hamburger for mobile */}
        <button
          className={`modern-hamburger${navOpen ? ' open' : ''}`}
          onClick={() => setNavOpen(!navOpen)}
          aria-label={
            navOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            <g>
              <rect
                className="bar top"
                x="6"
                y="9"
                width="20"
                height="3"
                rx="1.5"
              />
              <rect
                className="bar middle"
                x="6"
                y="15"
                width="20"
                height="3"
                rx="1.5"
              />
              <rect
                className="bar bottom"
                x="6"
                y="21"
                width="20"
                height="3"
                rx="1.5"
              />
            </g>
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav">
          <ul>
            {navLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={handleNavClick}
                  className={`nav-link${location.pathname === item.to ? ' active' : ''
                    }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  <div className="nav-indicator"></div>
                </Link>
              </li>
            ))}
            <li>
              <Notifications />
            </li>
            <li className="header-cta">
              <button
                className="btn-donate"
                onClick={() => {
                  navigate('/donate-blood');
                  setNavOpen(false);
                }}
              >
                <span className="btn-icon">🩸</span>
                <span className="btn-text">Donate</span>
                <div className="btn-glow"></div>
              </button>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">👋</span>
                <span className="logout-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Slide-in Menu */}
        <nav
          className={`mobile-nav${navOpen ? ' open' : ''}`}
          aria-hidden={!navOpen}
        >
          <button
            className="close-mobile-nav"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line
                x1="8"
                y1="8"
                x2="24"
                y2="24"
                stroke="#b91c1c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="24"
                y1="8"
                x2="8"
                y2="24"
                stroke="#b91c1c"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <ul>
            {navLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={handleNavClick}
                  className={`nav-link${location.pathname === item.to ? ' active' : ''
                    }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <Notifications />
            </li>
            <li className="header-cta">
              <button
                className="btn-donate"
                onClick={() => {
                  navigate('/donate-blood');
                  setNavOpen(false);
                }}
              >
                <span className="btn-icon">🩸</span>
                <span className="btn-text">Donate</span>
                <div className="btn-glow"></div>
              </button>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">👋</span>
                <span className="logout-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
