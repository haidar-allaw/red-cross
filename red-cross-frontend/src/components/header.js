import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';
import CenterNavbar from './CenterNavbar';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    return (
      <header className="site-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/redCrossIcon.png" alt="Red Cross Logo" style={{ height: 40 }} />
            <div className="logo-text">
              <span className="logo-main">LifeShare</span>
              <span className="logo-sub">Lebanon</span>
            </div>
          </Link>
          <div>
            <Link to="/login" className="btn-login" style={{ marginRight: 12 }}>Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        </div>
      </header>
    );
  }
  if (user.role === 'admin') return <AdminNavbar />;
  if (user.role === 'center') return <CenterNavbar />;
  return <UserNavbar />;
}
