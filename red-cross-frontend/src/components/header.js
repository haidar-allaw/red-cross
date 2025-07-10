import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';
import CenterNavbar from './CenterNavbar';

export default function Header() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'admin') return <AdminNavbar />;
  if (user.role === 'center') return <CenterNavbar />;
  return <UserNavbar />;
}
