"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "./aboutsection.css"
import allLives from "../../assets/all-lives.gif"

export default function AboutSection() {
    const [isVisible, setIsVisible] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.3 },
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const handleMouseMove = (e) => {
        const rect = sectionRef.current?.getBoundingClientRect()
        if (rect) {
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            })
        }
    }

    const stats = [
        { number: "85%", label: "Blood Bank Shortage", icon: "🩸" },
        { number: "1000+", label: "Lives at Risk Daily", icon: "⚠️" },
        { number: "24/7", label: "Emergency Response", icon: "🚨" },
    ]

    return (
        <section ref={sectionRef} className="about-section-enhanced" onMouseMove={handleMouseMove}>
            {/* Animated Background */}
            <div className="about-background">
                <div className="gradient-mesh"></div>
                <div
                    className="mouse-trail"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(211,47,47,0.1) 0%, transparent 50%)`,
                    }}
                ></div>

                {/* Floating Elements */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-shape"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <div className="about-container">
                {/* Stats Bar */}
                <div className={`stats-bar ${isVisible ? "visible" : ""}`}>
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="about-content-enhanced">
                    {/* Text Content */}
                    <div className={`about-text-enhanced ${isVisible ? "visible" : ""}`}>
                        <div className="content-wrapper">
                            <div className="section-badge">
                                <div className="badge-dot"></div>
                                <span>Our Mission</span>
                            </div>

                            <h2 className="about-heading-enhanced">
                                <span className="heading-line">No one should stress</span>
                                <span className="heading-line">or even die from a</span>
                                <span className="heading-line highlight">blood shortage</span>
                                <span className="heading-line">in Lebanon</span>
                            </h2>

                            <div className="about-underline-enhanced">
                                <div className="underline-main"></div>
                                <div className="underline-glow"></div>
                            </div>

                            <div className="about-paragraphs">
                                <p className="paragraph-enhanced">
                                    <span className="paragraph-icon">💔</span>
                                    Much blood has been wasted in the streets of Lebanon throughout its history.
                                </p>
                                <p className="paragraph-enhanced">
                                    <span className="paragraph-icon">🏥</span>
                                    Yet, blood banks are almost empty and families of patients in need of blood struggle to find potential
                                    donors every day.
                                </p>
                                <p className="paragraph-enhanced">
                                    <span className="paragraph-icon">🎯</span>
                                    Our mission is to improve the anonymous and voluntary blood donation system in Lebanon — for that, we
                                    created a movement.
                                </p>
                            </div>

                            <div className="cta-section">
                                <Link
                                    to="/about?tab=mission"
                                    className="about-btn-enhanced"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    <span className="btn-text">Read More</span>
                                    <span className="btn-arrow">→</span>
                                    <div className="btn-glow"></div>
                                </Link>

                                <div className="additional-links">
                                    <Link to="/impact" className="link-enhanced">
                                        <span className="link-icon">📊</span>
                                        View Impact
                                    </Link>
                                    <Link to="/stories" className="link-enhanced">
                                        <span className="link-icon">💝</span>
                                        Success Stories
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Content - Image Only */}
                    <div className={`about-visual-enhanced ${isVisible ? "visible" : ""}`}>
                        <div className="image-frame">
                            <div className="frame-border"></div>
                            <div className="image-wrapper">
                                <img
                                    src={allLives || "/placeholder.svg"}
                                    alt="Every Drop Counts Illustration"
                                    className="main-image"
                                />
                                <div className="image-overlay"></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Call to Action Banner */}
                <div className={`cta-banner ${isVisible ? "visible" : ""}`}>
                    <div className="banner-content">
                        <div className="banner-text">
                            <h3>Ready to Save Lives?</h3>
                            <p>Join thousands of heroes making a difference every day</p>
                        </div>
                        <div className="banner-actions">
                            <Link to="/donate" className="banner-btn primary">
                                <span className="btn-icon">🩸</span>
                                Donate Now
                            </Link>
                            <Link to="/volunteer" className="banner-btn secondary">
                                <span className="btn-icon">🤝</span>
                                Volunteer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
