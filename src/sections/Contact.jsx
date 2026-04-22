import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const infoItems = [
        { key: 'address', icon: <MapPin className="w-6 h-6" /> },
        { key: 'phone', icon: <Phone className="w-6 h-6" /> },
        { key: 'email', icon: <Mail className="w-6 h-6" /> },
        { key: 'hours', icon: <Clock className="w-6 h-6" /> }
    ];

    const socialLinks = [
        {
            icon: <Facebook className="w-5 h-5" />,
            url: 'https://www.facebook.com/Friendsgrp.AzurOneEleven',
            label: 'Facebook'
        },
        {
            icon: <Instagram className="w-5 h-5" />,
            url: 'https://www.instagram.com/Friendsgrp.AzurOneEleven',
            label: 'Instagram'
        },
    ];

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    variants={fadeIn('down', 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <span className="section-label">{t('nav.contact')}</span>
                    <h2 className="section-title">{t('contact.title')}</h2>
                    <p className="section-subtitle">{t('contact.subtitle')}</p>
                </motion.div>

                <div className="contact-info-grid">
                    {infoItems.map((item, index) => (
                        <motion.div
                            key={item.key}
                            className="info-box"
                            variants={fadeIn('up', 0.2 * index)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            <div className="info-icon">{item.icon}</div>
                            <div className="info-content">
                                <h5>{t(`contact.info.${item.key}_label`)}</h5>
                                <p>{t(`contact.info.${item.key}_val`)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="contact-main-grid">
                    <motion.div
                        className="contact-form-side"
                        variants={fadeIn('right', 0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <form className="structured-form">
                            <div className="form-group">
                                <input type="text" placeholder={t('booking.form.name')} />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder={t('booking.form.email')} />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder="Subject" />
                            </div>
                            <div className="form-group">
                                <textarea placeholder={t('booking.form.message')} rows="5"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary full-width">
                                {t('booking.form.submit')}
                            </button>
                        </form>

                        <div className="social-connect">
                            <span>{t('contact.social.follow')}</span>
                            <div className="social-icons">
                                {socialLinks.map((link, idx) => (
                                    <a key={idx} href={link.url} className="social-icon"
                                       target="_blank" rel="noopener noreferrer"
                                       aria-label={link.label}>
                                        {link.icon}
                                    </a>
                                ))}
                                <a
                                    href="https://wa.me/201207776033"
                                    className="social-icon whatsapp-icon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp"
                                >
                                    📲
                                </a>
                            </div>
                            <div className="google-actions">
                                <a
                                    href="https://www.google.com/search?q=Friends+Group+Spa+%26+Beauty#lrd=0x14bd5414e7a0f67b:0x5e0f0f0f0f0f0f0f,3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-google-review"
                                >
                                    <span className="g-icon">G</span> {t('contact.social.google_review')}
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="contact-map-side"
                        variants={fadeIn('left', 0.6)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <div className="map-container">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113941.350616194!2d33.8231254!3d27.2366861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bd5414e7a0f67b%3A0x10f0f0f0f0f0f0f0!2sFriends%20Group%20Spa%20!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
