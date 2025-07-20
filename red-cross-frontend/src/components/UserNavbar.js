import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './header.css';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import axios from 'axios';
import { getTokenPayload } from '../utils/jwtUtils';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const navLinks = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Request Blood', to: '/request', icon: '🆘' },
  { label: 'Hospitals', to: '/hospitals', icon: '🏥' },
  { label: 'About', to: '/about', icon: 'ℹ️' },
];

export default function UserNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  // Add this state for demo (replace with real notification count later)
  const [notifCount, setNotifCount] = useState(0);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [readNotifs, setReadNotifs] = useState([]); // store read notification IDs

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const payload = getTokenPayload(token);
        if (!payload || !payload.id) return;
        const { data } = await axios.get(`http://localhost:4000/api/bloodRequests/user/${payload.id}`);
        // Only accepted/rejected requests
        const notifs = data.filter(req => req.status === 'Approved' || req.status === 'Rejected');
        setNotifications(notifs);
        // Only count unread
        setNotifCount(notifs.filter(n => !readNotifs.includes(n._id)).length);
      } catch (err) {
        setNotifications([]);
        setNotifCount(0);
      }
    };
    fetchNotifications();
    // eslint-disable-next-line
  }, [readNotifs]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setNavOpen(false);
  };

  const handleNavClick = () => setNavOpen(false);

  const handleNotifBellClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
    // Mark all as read after opening
    setReadNotifs(notifications.map(n => n._id));
    setNotifCount(0);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };
  const notifOpen = Boolean(notifAnchorEl);

  const handleClearNotifications = () => {
    setReadNotifs(notifications.map(n => n._id));
    setNotifications([]);
    setNotifCount(0);
    handleNotifClose();
  };

  return (
    <header className="site-header">
      {navOpen && (
        <div className="nav-backdrop" onClick={() => setNavOpen(false)}></div>
      )}
      <div className="container">
        {/* Logo */}
        <Link
          to="/"
          className="logo"
          onClick={handleNavClick}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <img
            src="/redCrossIcon.png"
            alt="Red Cross Logo"
            style={{ height: 40 }}
          />
          <div className="logo-text">
            <span className="logo-main">LifeShare</span>
            <span className="logo-sub">Lebanon</span>
          </div>
        </Link>

        {/* Modern Animated Hamburger for mobile */}
        <button
          className={`modern-hamburger${navOpen ? ' open' : ''}`}
          onClick={() => setNavOpen(!navOpen)}
          aria-label={
            navOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            <g>
              <rect
                className="bar top"
                x="6"
                y="9"
                width="20"
                height="3"
                rx="1.5"
              />
              <rect
                className="bar middle"
                x="6"
                y="15"
                width="20"
                height="3"
                rx="1.5"
              />
              <rect
                className="bar bottom"
                x="6"
                y="21"
                width="20"
                height="3"
                rx="1.5"
              />
            </g>
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav">
          <ul>
            {navLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={handleNavClick}
                  className={`nav-link${location.pathname === item.to ? ' active' : ''
                    }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  <div className="nav-indicator"></div>
                </Link>
              </li>
            ))}
            <li>
              <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleNotifBellClick}>
                <Badge badgeContent={notifCount} color="error">
                  <NotificationsNoneIcon fontSize="medium" />
                </Badge>
              </IconButton>
              <Popover
                open={notifOpen}
                anchorEl={notifAnchorEl}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { minWidth: 320, p: 1 } }}
              >
                <Typography sx={{ fontWeight: 700, p: 1 }}>Notifications</Typography>
                <List dense>
                  {notifications.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No notifications yet." />
                    </ListItem>
                  ) : notifications.map((notif) => (
                    <ListItem key={notif._id} sx={{ bgcolor: notif.status === 'Approved' ? '#e8f5e9' : '#ffebee', borderRadius: 1, mb: 0.5 }}>
                      <ListItemText
                        primary={`Your request for ${notif.bloodType} was ${notif.status === 'Approved' ? 'accepted' : 'rejected'}.`}
                        secondary={
                          notif.status === 'Rejected' && notif.rejectionReason
                            ? `Reason: ${notif.rejectionReason}`
                            : `Date: ${new Date(notif.approvedAt).toLocaleDateString()}`
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                {notifications.length > 0 && (
                  <Button fullWidth color="error" onClick={handleClearNotifications} sx={{ mt: 1 }}>
                    Clear All
                  </Button>
                )}
              </Popover>
            </li>
            <li className="header-cta">
              <button
                className="btn-donate"
                onClick={() => {
                  navigate('/donate-blood');
                  setNavOpen(false);
                }}
              >
                <span className="btn-icon">🩸</span>
                <span className="btn-text">Donate</span>
                <div className="btn-glow"></div>
              </button>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">👋</span>
                <span className="logout-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Slide-in Menu */}
        <nav
          className={`mobile-nav${navOpen ? ' open' : ''}`}
          aria-hidden={!navOpen}
        >
          <button
            className="close-mobile-nav"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line
                x1="8"
                y1="8"
                x2="24"
                y2="24"
                stroke="#b91c1c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="24"
                y1="8"
                x2="8"
                y2="24"
                stroke="#b91c1c"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <ul>
            {navLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={handleNavClick}
                  className={`nav-link${location.pathname === item.to ? ' active' : ''
                    }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleNotifBellClick}>
                <Badge badgeContent={notifCount} color="error">
                  <NotificationsNoneIcon fontSize="medium" />
                </Badge>
              </IconButton>
              <Popover
                open={notifOpen}
                anchorEl={notifAnchorEl}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { minWidth: 320, p: 1 } }}
              >
                <Typography sx={{ fontWeight: 700, p: 1 }}>Notifications</Typography>
                <List dense>
                  {notifications.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No notifications yet." />
                    </ListItem>
                  ) : notifications.map((notif) => (
                    <ListItem key={notif._id} sx={{ bgcolor: notif.status === 'Approved' ? '#e8f5e9' : '#ffebee', borderRadius: 1, mb: 0.5 }}>
                      <ListItemText
                        primary={`Your request for ${notif.bloodType} was ${notif.status === 'Approved' ? 'accepted' : 'rejected'}.`}
                        secondary={
                          notif.status === 'Rejected' && notif.rejectionReason
                            ? `Reason: ${notif.rejectionReason}`
                            : `Date: ${new Date(notif.approvedAt).toLocaleDateString()}`
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                {notifications.length > 0 && (
                  <Button fullWidth color="error" onClick={handleClearNotifications} sx={{ mt: 1 }}>
                    Clear All
                  </Button>
                )}
              </Popover>
            </li>
            <li className="header-cta">
              <button
                className="btn-donate"
                onClick={() => {
                  navigate('/donate-blood');
                  setNavOpen(false);
                }}
              >
                <span className="btn-icon">🩸</span>
                <span className="btn-text">Donate</span>
                <div className="btn-glow"></div>
              </button>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">👋</span>
                <span className="logout-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
