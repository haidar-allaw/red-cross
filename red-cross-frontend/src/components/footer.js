// Footer.jsx
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => (
    <footer className="site-footer">
        <Link to="/about">About</Link>|
        <Link to="/volunteer">Volunteer</Link>|
        <Link to="/contact">Contact</Link>
        <div>© {new Date().getFullYear()} Red Cross</div>
    </footer>
);

export default Footer;
