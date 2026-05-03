import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { BUSINESS_INFO } from '../config/constants';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <Facebook strokeWidth={1.5} />, url: BUSINESS_INFO.SOCIAL.FACEBOOK, label: 'Facebook' },
        { icon: <Instagram strokeWidth={1.5} />, url: BUSINESS_INFO.SOCIAL.INSTAGRAM, label: 'Instagram' },
        { icon: <Twitter strokeWidth={1.5} />, url: BUSINESS_INFO.SOCIAL.TWITTER, label: 'Twitter' },
        { icon: <Linkedin strokeWidth={1.5} />, url: BUSINESS_INFO.SOCIAL.LINKEDIN, label: 'LinkedIn' },
    ];

    const footerLinks = {
        company: [
            { name: t('nav.home'), url: '/' },
            { name: t('nav.about'), url: '/#about' },
            { name: t('nav.booking'), url: '/#booking' },
            { name: t('nav.contact'), url: '/#contact' },
        ],
        services: [
            { name: t('services.spa.category'), url: '/#services' },
            { name: t('services.travel.category'), url: '/#services' },
            { name: t('spa_menu.title'), url: '/menu', isRoute: true },
        ],
    };

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container footer-container">
                    <motion.div 
                        className="footer-brand"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                    >
                        <img src={logo} alt="Friends Group Logo" className="footer-logo" />
                        <p className="footer-brand-desc">
                            {t('about.story_content')}
                        </p>
                        <div className="footer-socials">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    <div className="footer-links-grid">
                        <motion.div 
                            className="footer-link-col"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.2, 0, 0.2, 1] }}
                            viewport={{ once: true }}
                        >
                            <h4 className="footer-col-title">{t('nav.about')}</h4>
                            <ul className="footer-list">
                                {footerLinks.company.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div 
                            className="footer-link-col"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.2, 0, 0.2, 1] }}
                            viewport={{ once: true }}
                        >
                            <h4 className="footer-col-title">{t('nav.services')}</h4>
                            <ul className="footer-list">
                                {footerLinks.services.map((link, i) => (
                                    <li key={i}>
                                        {link.isRoute ? (
                                            <Link to={link.url}>{link.name}</Link>
                                        ) : (
                                            <a href={link.url}>{link.name}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div 
                            className="footer-link-col"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.2, 0, 0.2, 1] }}
                            viewport={{ once: true }}
                        >
                            <h4 className="footer-col-title">{t('nav.contact')}</h4>
                            <ul className="footer-contact-list">
                                <li>
                                    <MapPin className="contact-icon" />
                                    <span>{BUSINESS_INFO.LOCATIONS.HURGHADA.NAME}</span>
                                </li>
                                <li>
                                    <Phone className="contact-icon" />
                                    <span>{BUSINESS_INFO.WHATSAPP}</span>
                                </li>
                                <li>
                                    <Mail className="contact-icon" />
                                    <span>{BUSINESS_INFO.EMAILS.INFO}</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-container">
                    <p className="copyright">
                        &copy; {currentYear} Friends Group. Everywhere Luxury Since {BUSINESS_INFO.FOUNDED_YEAR}.
                    </p>
                    <div className="footer-legal">
                        <Link to="/roadmap">Roadmap</Link>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
