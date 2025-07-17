import React from 'react';

export default function Forbidden() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <h1 style={{ color: '#b71c1c', fontSize: '3rem', marginBottom: '1rem' }}>403 Forbidden</h1>
      <p style={{ fontSize: '1.3rem', color: '#444', marginBottom: '2rem' }}>
        You do not have permission to access this page.<br />
        (But here's a meme to cheer you up!)
      </p>
      <img
        src="accessissue.jpg"
        alt="Access Denied Meme"
        style={{ maxWidth: 400, width: '100%', borderRadius: 16, boxShadow: '0 8px 32px rgba(183, 28, 28, 0.15)' }}
      />
      <p style={{ marginTop: '2rem', color: '#888' }}>
        <a href="/" style={{ color: '#b71c1c', textDecoration: 'underline', fontWeight: 600 }}>Go back to Home</a>
      </p>
    </div>
  );
} 