import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: 'var(--soft-background, #0a0908)',
                    color: 'var(--text-primary, #F2F1EE)',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    padding: '40px',
                    textAlign: 'center',
                }}>
                    <h2 style={{
                        fontFamily: 'var(--font-headings, Playfair Display, serif)',
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        marginBottom: '20px',
                        color: 'var(--primary-gold, #C9A84C)',
                    }}>
                        Something went wrong
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        opacity: 0.7,
                        maxWidth: '500px',
                        lineHeight: 1.6,
                        marginBottom: '40px',
                    }}>
                        We apologize for the inconvenience. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '18px 50px',
                            background: 'var(--primary-gold, #C9A84C)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            cursor: 'pointer',
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
