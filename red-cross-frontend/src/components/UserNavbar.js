"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./header.css"

const navLinks = [
    { label: "Home", to: "/", icon: "🏠" },
    { label: "Request Blood", to: "/request", icon: "🆘" },
    { label: "Donate Blood", to: "/donate-blood", icon: "🩸" },
    { label: "Hospitals", to: "/hospitals", icon: "🏥" },
    { label: "About", to: "/about", icon: "ℹ️" },
]

export default function UserNavbar() {
    const [navOpen, setNavOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate("/login")
        setNavOpen(false)
    }

    const handleNavClick = () => {
        setNavOpen(false)
    }

    return (
        <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
            {/* Animated Background */}
            <div className="header-background">
                <div className="gradient-overlay"></div>
                <div className="floating-particles">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="container">
                {/* Enhanced Logo */}
                <Link to="/" className="logo" onClick={handleNavClick}>
                    <div className="logo-wrapper">
                        <div className="logo-glow"></div>
                        <img src="/redCrossIcon.png" alt="Red Cross Logo" />
                        <div className="logo-text">
                            <span className="logo-main">LifeShare</span>
                            <span className="logo-sub">Lebanon</span>
                        </div>
                    </div>
                </Link>



                {/* Enhanced Mobile Toggle */}
                <button
                    className={`nav-toggle ${navOpen ? "active" : ""}`}
                    onClick={() => setNavOpen(!navOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {/* Enhanced Navigation */}
                <nav className={`main-nav${navOpen ? " open" : ""}`}>
                    <div className="nav-backdrop"></div>
                    <ul>
                        {navLinks.map((item) => (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    onClick={handleNavClick}
                                    className={`nav-link ${location.pathname === item.to ? "active" : ""}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-text">{item.label}</span>
                                    <div className="nav-indicator"></div>
                                </Link>
                            </li>
                        ))}
                        <li className="header-cta">
                            <Link to="/donate-blood" className="btn-donate" onClick={handleNavClick}>
                                <span className="btn-icon">🩸</span>
                                <span className="btn-text">Donate</span>
                                <div className="btn-glow"></div>
                            </Link>
                        </li>
                        <li className="logout-item">
                            <button onClick={handleLogout} className="btn-logout">
                                <span className="logout-icon">👋</span>
                                <span className="logout-text">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Overlay */}
                {navOpen && <div className="mobile-overlay" onClick={() => setNavOpen(false)}></div>}
            </div>

            {/* Scroll Progress Bar */}
            <div className="scroll-progress">
                <div
                    className="progress-bar"
                    style={{
                        transform: `scaleX(${Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1)})`,
                    }}
                ></div>
            </div>
        </header>
    )
}
