import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <Facebook strokeWidth={1.5} />, url: 'https://facebook.com/Friendsgrp.AzurOneEleven', label: 'Facebook' },
        { icon: <Instagram strokeWidth={1.5} />, url: 'https://instagram.com/Friendsgrp.AzurOneEleven', label: 'Instagram' },
        { icon: <Twitter strokeWidth={1.5} />, url: 'https://twitter.com', label: 'Twitter' },
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
            { name: "Special Promotions", url: '/promotions', isRoute: true },
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
                                    <span>{t('contact.info.address_val')}</span>
                                </li>
                                <li>
                                    <Phone className="contact-icon" />
                                    <span>{t('contact.info.phone_val')}</span>
                                </li>
                                <li>
                                    <Mail className="contact-icon" />
                                    <span>{t('contact.info.email_val')}</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-container">
                    <p className="copyright">
                        &copy; {currentYear} Friends Group. Everywhere Luxury Since 2003.
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
