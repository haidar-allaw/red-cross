import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleNav = () => setMenuOpen(open => !open);
    const closeNav = () => setMenuOpen(false);

    return (
        <header className="site-header">
            <div className="container">
                <Link to="/" className="logo" onClick={closeNav}>
                    <img src="./redCrossIcon.png" alt="Red Cross Logo" />
                </Link>

                <button
                    className="nav-toggle"
                    aria-label="Toggle navigation"
                    onClick={toggleNav}
                >
                    ☰
                </button>

                <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={closeNav}>Home</Link></li>
                        <li><Link to="/donate-blood" onClick={closeNav}>Donate Blood</Link></li>
                        <li><Link to="/our-work" onClick={closeNav}>Our Work</Link></li>
                        <li><Link to="/volunteer" onClick={closeNav}>Volunteer</Link></li>
                        <li><Link to="/resources" onClick={closeNav}>Resources</Link></li>
                        <li><Link to="/contact" onClick={closeNav}>Contact</Link></li>
                        {/* New Nearby Hospitals Link */}
                        <li><Link to="/hospitals" onClick={closeNav}>Find Hospitals</Link></li>
                        <li className="donate-mobile">
                            <Link to="/donate" onClick={closeNav} className="btn-donate">
                                Donate
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-cta">
                    <Link to="/donate" className="btn-donate">Donate</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;