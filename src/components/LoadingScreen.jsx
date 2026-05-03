import React from 'react';

const LoadingScreen = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--soft-background, #0a0908)',
        color: 'var(--text-primary, #F2F1EE)',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
        gap: '30px',
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(201, 168, 76, 0.15)',
            borderTop: '2px solid var(--primary-gold, #C9A84C)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        }} />
        <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '4px',
            color: 'var(--primary-gold, #C9A84C)',
            opacity: 0.6,
        }}>
            Loading
        </span>
        <style>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

export default LoadingScreen;
