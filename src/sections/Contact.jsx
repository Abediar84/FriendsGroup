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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const subject = formData.subject || 'New Contact Inquiry';
        
        // Construct a beautifully formatted HTML email
        const htmlBody = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #1a1208; padding: 20px; text-align: center; border-bottom: 3px solid #d4af37;">
                    <h2 style="color: #d4af37; margin: 0; letter-spacing: 1px;">Friends Group - Contact Us</h2>
                </div>
                <div style="padding: 30px; background-color: #fcfcfc;">
                    <h3 style="color: #1a1208; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">Sender Information</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 120px;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formData.name}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formData.email}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td></tr>
                    </table>

                    <h3 style="color: #1a1208; border-bottom: 1px solid #eee; padding-bottom: 10px;">Message</h3>
                    <div style="background-color: #fff; padding: 15px; border: 1px solid #eee; border-radius: 4px; line-height: 1.6;">
                        ${formData.message.replace(/\n/g, '<br/>')}
                    </div>
                </div>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    This message was sent from the Contact form on the Friends Group portal.
                </div>
            </div>
        `;
                     
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, html: htmlBody })
            });

            if (!response.ok) throw new Error('Failed to send email');
            
            alert('Your message has been sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again or contact us via WhatsApp.');
        }
    };

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
                        <form className="structured-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="text" name="name" placeholder={t('booking.form.name')} value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <input type="email" name="email" placeholder={t('booking.form.email')} value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <textarea name="message" placeholder={t('booking.form.message')} rows="5" value={formData.message} onChange={handleChange} required></textarea>
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
