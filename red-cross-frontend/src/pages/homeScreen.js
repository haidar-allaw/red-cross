import Hero from "../components/hero";
import AboutSection from '../components/about/aboutsection';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function HomeScreen() {
    const { user } = useAuth();
    return (
        <div>
            {/* Show login button if not logged in */}
            {!user && (
                <div style={{ textAlign: 'right', margin: '1rem' }}>
                    <Link to="/login" className="btn-login" style={{ fontWeight: 600, color: '#B71C1C', textDecoration: 'underline' }}>
                        Login
                    </Link>
                </div>
            )}
            <Hero />
            <AboutSection />
        </div>)
}

export default HomeScreen;