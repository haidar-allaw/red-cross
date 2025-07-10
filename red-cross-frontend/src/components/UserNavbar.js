import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './header.css';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Request Blood', to: '/request' },
    { label: 'Donate Blood', to: '/donate-blood' },
    { label: 'Hospitals', to: '/hospitals' },
    { label: 'About', to: '/about' },
];

export default function UserNavbar() {
    const [navOpen, setNavOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <header className="site-header">
            <div className="container">
                <Link to="/" className="logo">
                    <img src="/redCrossIcon.png" alt="Red Cross Logo" />
                </Link>
                <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
                    <span role="img" aria-label="menu">☰</span>
                </button>
                <nav className={`main-nav${navOpen ? ' open' : ''}`}>
                    <ul>
                        {navLinks.map((item) => (
                            <li key={item.to}>
                                <Link to={item.to} onClick={() => setNavOpen(false)}>{item.label}</Link>
                            </li>
                        ))}
                        <li className="header-cta">
                            <Link to="/donate-blood" className="btn-donate" onClick={() => setNavOpen(false)}>
                                Donate
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#d32f2f', fontWeight: 600, cursor: 'pointer', marginLeft: 8 }}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
} 