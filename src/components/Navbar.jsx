import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import './Navbar.css';

import logo from '../assets/logo.png';

const Navbar = () => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    // Desktop scroll progress indicator
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen, isMobile]);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
        setMenuOpen(false);
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    // Direction-aware variants
    const menuVariants = {
        closed: {
            x: language === 'ar' ? '-100%' : '100%',
            opacity: 0
        },
        open: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0 }
    };

    const baseUrl = import.meta.env.BASE_URL || "/";

    const navItems = [
        { key: 'home', path: '#home' },
        { key: 'about', path: '#about' },
        { key: 'services', path: '#services' },
        { key: 'gallery', path: '#gallery' },
        { key: 'booking', path: '#booking' },
        { key: 'testimonials', path: '#testimonials' },
        { key: 'contact', path: '#contact' }
    ];

    const getPath = (item) => {
        if (item.isRoute) return `${baseUrl}${item.path.replace('/', '')}`;
        return `${baseUrl}#${item.path.replace('#', '')}`;
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-active' : ''}`} aria-label="Main Navigation">
            <div className="container nav-container">
                <motion.div
                    className="logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={() => {
                        window.location.href = baseUrl;
                        closeMenu();
                    }}
                >
                    <img src={logo} alt="Friends Group Logo" className="logo-img" />
                </motion.div>

                {/* Desktop Menu */}
                {!isMobile && (
                    <div className="nav-links-wrapper">
                        <ul className="nav-links">
                            {navItems.map((item) => (
                                <li key={item.key}>
                                    <a 
                                        href={getPath(item)} 
                                        className="nav-link-item" 
                                        onClick={closeMenu}
                                    >
                                        {t(`nav.${item.key}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Mobile Menu with AnimatePresence */}
                <AnimatePresence>
                    {isMobile && menuOpen && (
                        <motion.div 
                            className="nav-links-wrapper open"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                        >
                            <ul className="nav-links">
                                {navItems.map((item) => (
                                    <motion.li key={item.key} variants={itemVariants}>
                                        <a 
                                            href={getPath(item)} 
                                            className="nav-link-item" 
                                            onClick={closeMenu}
                                        >
                                            {t(`nav.${item.key}`)}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="nav-actions">
                    <motion.button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </motion.button>

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
            
            {/* Desktop Scroll Progress Indicator */}
            {!isMobile && (
                <motion.div
                    className="scroll-progress-bar"
                    style={{ scaleX, transformOrigin: language === 'ar' ? "right" : "left" }}
                />
            )}
        </nav>
    );
};

export default Navbar;
