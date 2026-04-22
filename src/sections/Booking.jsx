import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import './Booking.css';

const Booking = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        location: '',
        date: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = true;
        if (!formData.phone || !/^\+?[0-9]{8,15}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = true;
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
        if (!formData.service) newErrors.service = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            // In a real app, you would send email notification here via EmailJS or Backend
        }, 1500);
    };

    const handleWhatsApp = () => {
        if (!validate()) return;

        const message = `*New Inquiry from Friends Group Website*%0A%0A` +
            `*Name:* ${formData.name}%0A` +
            `*Service:* ${formData.service}%0A` +
            `*Location:* ${formData.location}%0A` +
            `*Date:* ${formData.date}%0A` +
            `*Phone:* ${formData.phone}%0A` +
            `*Email:* ${formData.email}`;

        const whatsappUrl = `https://wa.me/201207776033?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section id="booking" className="booking-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    variants={fadeIn('down', 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <span className="section-label">{t('nav.booking')}</span>
                    <h2 className="section-title">{t('booking.title')}</h2>
                    <p className="section-subtitle">{t('booking.subtitle')}</p>
                </motion.div>

                <div className="booking-grid">
                    <motion.div
                        className="booking-form-wrapper"
                        variants={fadeIn('right', 0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    className="success-message"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="success-icon">✓</div>
                                    <h3>{t('booking.status.success')}</h3>
                                    <button className="btn btn-outline" onClick={() => setStatus('idle')}>
                                        Send Another Inquiry
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="premium-form">
                                    <div className="form-row">
                                        <div className={`form-group ${errors.name ? 'error' : ''}`}>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder={t('booking.form.name')}
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder={t('booking.form.phone')}
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className={`form-group ${errors.email ? 'error' : ''}`}>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder={t('booking.form.email')}
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className={`form-group ${errors.date ? 'error' : ''}`}>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className={`form-group ${errors.service ? 'error' : ''}`}>
                                            <select name="service" value={formData.service} onChange={handleChange}>
                                                <option value="" disabled>{t('booking.form.select_service')}</option>
                                                <option value="SPA">SPA & Wellness</option>
                                                <option value="Travel">Travel & Tourism</option>
                                                <option value="Corporate">Corporate Services</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <select name="location" value={formData.location} onChange={handleChange}>
                                                <option value="" disabled>{t('booking.form.select_location')}</option>
                                                <option value="New Alamein">New Alamein — Azur One Eleven Hotel</option>
                                                <option value="Hurghada">Hurghada — Giftun Azur Resort</option>
                                                <option value="Other">Other / Custom Location</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                                            {status === 'loading' ? 'Processing...' : t('booking.form.submit')}
                                        </button>
                                        <button type="button" className="btn btn-whatsapp" onClick={handleWhatsApp}>
                                            <span className="wa-icon">📲</span> {t('booking.form.whatsapp')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="booking-info"
                        variants={fadeIn('left', 0.6)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <div className="info-card">
                            <h4>{t('booking.benefits.title')}</h4>
                            <ul className="benefits-list">
                                {t('booking.benefits.list').map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Booking;
