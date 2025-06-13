// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube,
} from 'react-icons/fa';
// import dropGraphic from '../public/drop-exclamation.png';
// import phoneMockup from '../assets/phone-map.png';
import './hero.css';

const socials = [
    { icon: <FaFacebookF />, url: 'https://facebook.com' },
    { icon: <FaInstagram />, url: 'https://instagram.com' },
    { icon: <FaTwitter />, url: 'https://twitter.com' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com' },
    { icon: <FaYoutube />, url: 'https://youtube.com' },
];

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">

                <div className="hero-text">
                    <h1>
                        EVERY DOT BLINKING<br />
                        IS SOMEONE IN NEED OF<br />
                        BLOOD, <span className="now">NOW.</span>
                    </h1>
                    <p>Check the live map and help save a life.</p>
                    <div className="hero-cta">
                        <Link to="/request" className="btn btn-outline">
                            Request Blood
                        </Link>
                        <Link to="/donate" className="btn btn-primary">
                            Give Blood
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <img src="./drop-exclamation.png" alt="" className="drop-bg" />
                    {/* <img src={`${process.env.PUBLIC_URL}/drop-exclamation.png`} alt="" className="drop-bg" /> */}
                </div>

            </div>

            <ul className="social-list">
                {socials.map((s, i) => (
                    <li key={i}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {s.icon}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="hotline">
                <span className="phone-icon">📞</span> 01 390 320
            </div>
            {/* ── Nearby Hospitals toggle bar ── */}
            <div className="nearby-bar">
                <h2>Donate blood near you</h2>
                <div className="toggle-buttons">
                    <Link to="/hospitals" className="toggle-btn">Map</Link>
                    <Link to="/hospitals?view=list" className="toggle-btn">List</Link>
                </div>
            </div>
        </section>
    );
}
