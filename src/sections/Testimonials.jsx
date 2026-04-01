import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import './Testimonials.css';

const Testimonials = () => {
    const { t } = useLanguage();

    const reviews = t('testimonials.items') || [];

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    variants={fadeIn('down', 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                >
                    <span className="section-label">{t('nav.testimonials')}</span>
                    <h2 className="section-title">{t('testimonials.title')}</h2>
                    <p className="section-subtitle">{t('testimonials.subtitle')}</p>
                </motion.div>

                <div className="testimonials-grid">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            className="testimonial-card"
                            variants={fadeIn('up', 0.2 + (index * 0.1))}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <div className="card-top">
                                <div className="stars">★★★★★</div>
                                <div className="quote-icon">“</div>
                            </div>
                            <p className="testimonial-text">{review.text}</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{review.name.charAt(0)}</div>
                                <div className="author-info">
                                    <h4>{review.name}</h4>
                                    <span>{review.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
