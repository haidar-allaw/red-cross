"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./hero.css"

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(false)
    const [activeCard, setActiveCard] = useState(null)

    useEffect(() => {
        setIsVisible(true)

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const giveCards = [
        {
            icon: "🩸",
            title: "Give Blood",
            href: "/give-blood",
            gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            shadow: "rgba(239, 68, 68, 0.4)",
        },
        {
            icon: "🤝",
            title: "Give Time",
            href: "/give-time",
            gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            shadow: "rgba(59, 130, 246, 0.4)",
        },
        {
            icon: "🚚",
            title: "Give Space",
            href: "/give-space",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            shadow: "rgba(16, 185, 129, 0.4)",
        },
        {
            icon: "🎁",
            title: "Give Support",
            href: "/give-support",
            gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            shadow: "rgba(139, 92, 246, 0.4)",
        },
    ]

    return (
        <section className="enhanced-hero">
            {/* Animated Background */}
            <div className="hero-background">
                <div className="gradient-overlay"></div>
                <div
                    className="mouse-gradient"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239,68,68,0.15) 0%, transparent 50%)`,
                    }}
                ></div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Hero Content */}
            <div className="hero-container">
                <div className="hero-grid">
                    {/* Hero Text */}
                    <div className={`hero-text-enhanced ${isVisible ? "visible" : ""}`}>
                        <div className="hero-content-wrapper">
                            <div className="urgent-badge">
                                <div className="pulse-dot"></div>
                                <span>URGENT: Lives Need Saving</span>
                            </div>

                            <h1 className="hero-title-enhanced">
                                <span className="title-line">EVERY DOT</span>
                                <span className="title-line blinking">BLINKING</span>
                                <span className="title-line">IS SOMEONE IN</span>
                                <span className="title-line">NEED OF BLOOD,</span>
                                <span className="title-line now-enhanced">NOW.</span>
                            </h1>

                            <p className="hero-description-enhanced">
                                Check the live map and help save a life. Every donation can save up to 3 lives.
                            </p>

                            {/* CTA Buttons */}
                            <div className="cta-buttons-enhanced">
                                <Link to="/request" className="btn-enhanced btn-primary-enhanced">
                                    <span className="btn-content">
                                        <span className="btn-icon">❤️</span>
                                        Request Blood
                                    </span>
                                </Link>

                                <Link to="/donate" className="btn-enhanced btn-secondary-enhanced">
                                    <span className="btn-content">
                                        <span className="btn-icon">🤝</span>
                                        Give Blood
                                    </span>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-number">2M+</div>
                                    <div className="stat-label">Lives Saved</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">50K+</div>
                                    <div className="stat-label">Active Donors</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">24/7</div>
                                    <div className="stat-label">Emergency Support</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className={`hero-visual-enhanced ${isVisible ? "visible" : ""}`}>
                        <div className="visual-container">
                            <div className="blood-drop-container">
                                <div className="blood-drop-main"></div>
                                <div className="blood-drop-overlay"></div>

                                {/* Ripple Effect */}
                                <div className="ripple-container">
                                    <div className="ripple ripple-1"></div>
                                    <div className="ripple ripple-2"></div>
                                    <div className="ripple ripple-3"></div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="floating-element"
                                    style={{
                                        left: `${20 + Math.random() * 60}%`,
                                        top: `${20 + Math.random() * 60}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        animationDuration: `${2 + Math.random() * 2}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency Hotline */}
            <div className="emergency-hotline">
                <div className="hotline-button">
                    <span className="phone-icon-enhanced">📞</span>
                    01 390 320
                </div>
                <div className="hotline-tooltip">Emergency Hotline</div>
            </div>

            {/* Nearby Hospitals Bar */}
            <div className="nearby-bar-enhanced">
                <div className="nearby-content">
                    <div className="nearby-header">
                        <span className="map-icon">📍</span>
                        <h2>Donate blood near you</h2>
                    </div>

                    <div className="toggle-buttons-enhanced">
                        <Link to="/hospitals" className="toggle-btn-enhanced">
                            <span className="btn-icon">🗺️</span>
                            Map View
                        </Link>
                        <Link to="/hospitals?view=list" className="toggle-btn-enhanced">
                            <span className="btn-icon">👥</span>
                            List View
                        </Link>
                    </div>
                </div>
            </div>



            {/* Bottom Gradient */}
            <div className="bottom-gradient"></div>
        </section>
    )
}
