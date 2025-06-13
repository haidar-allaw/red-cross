import React from 'react';
import { Link } from 'react-router-dom';
import './aboutsection.css';
// import aboutIllustration from '../assets/about-illustration.png';

export default function AboutSection() {
    return (
        <section className="about-section">
            <div className="about-content">
                <div className="about-text">
                    <h2 className="about-heading">
                        No one should stress or even die from a blood shortage in Lebanon
                    </h2>
                    <div className="about-underline" />
                    <p>
                        Much blood has been wasted in the streets of Lebanon throughout its history.
                    </p>
                    <p>
                        Yet, blood banks are almost empty and families of patients in need of
                        blood struggle to find potential donors every day.
                    </p>
                    <p>
                        Our mission is to improve the anonymous and voluntary blood donation
                        system in Lebanon — for that, we created a movement.
                    </p>
                    <Link to="/about?tab=mission" smooth className="btn btn-outline about-btn">
                        Read More &rarr;
                    </Link>
                </div>
                {/* <div className="about-visual">
                    <img src={aboutIllustration} alt="Every Drop Counts Illustration" />
                </div> */}
            </div>
        </section>
    );
}
