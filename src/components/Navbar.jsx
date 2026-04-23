import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import './Navbar.css';

import logo from '../assets/logo.png';

const Navbar = () => {
    const { t, language, setLanguage } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
        setMenuOpen(false);
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-active' : ''}`} aria-label="Main Navigation">
            <div className="container nav-container">
                <motion.div
                    className="logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={closeMenu}
                >
                    <img src={logo} alt="Friends Group Logo" className="logo-img" />
                </motion.div>

                <div className={`nav-links-wrapper ${menuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        {['home', 'services', 'about', 'testimonials', 'contact'].map((item) => (
                            <li key={item}>
                                <a href={`#${item}`} className="nav-link-item" onClick={closeMenu}>{t(`nav.${item}`)}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="nav-actions">
                    <motion.button
                        className="lang-toggle"
                        onClick={toggleLanguage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle Language"
                    >
                        {language === 'en' ? 'العربية' : 'English'}
                    </motion.button>

                    <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                        <span className={`hamburger ${menuOpen ? 'active' : ''}`}></span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
