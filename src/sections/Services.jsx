import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import './Services.css';

const Services = () => {
    const { t } = useLanguage();

    const spaServices = [
        { id: 'massage', img: './images/service_spa.png' },
        { id: 'body', img: 'https://images.unsplash.com/photo-1570172619380-adb31f74b30c?auto=format&fit=crop&q=80&w=800' },
        { id: 'bath', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' },
        { id: 'sauna', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800' },
        { id: 'gym', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
        { id: 'packages', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=800' }
    ];

    const travelServices = [
        { id: 'domestic', img: './images/service_travel.png' },
        { id: 'international', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
        { id: 'corporate', img: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&q=80&w=800' },
        { id: 'custom', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800' }
    ];

    const renderGrid = (services, categoryKey) => (
        <div className="services-category-block">
            <motion.h3 
                className="category-title"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.2, 0, 0.2, 1] }}
                viewport={{ once: true }}
            >
                {t(`services.${categoryKey}.category`)}
            </motion.h3>
            <div className="services-grid">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        className="service-card interactive"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 1.2, 
                            ease: [0.2, 0, 0.2, 1],
                            delay: index * 0.1 
                        }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <div className="service-img-wrapper">
                            <img
                                src={service.img}
                                alt={t(`services.${categoryKey}.${service.id}.title`)}
                                className="service-img"
                                loading="lazy"
                            />
                            <div className="img-overlay"></div>
                        </div>
                        <div className="service-info">
                            <h4 className="service-name">{t(`services.${categoryKey}.${service.id}.title`)}</h4>
                            <p className="service-desc">{t(`services.${categoryKey}.${service.id}.desc`)}</p>
                            <a href="#contact" className="btn-service-cta">{t('services.cta')}</a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <section id="services" className="services-section refined">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
                    viewport={{ once: true }}
                >
                    <span className="section-label">{t('nav.services')}</span>
                    <h2 className="section-title">{t('services.title')}</h2>
                    <p className="section-subtitle">{t('services.subtitle')}</p>
                </motion.div>

                {renderGrid(spaServices, 'spa')}
                {renderGrid(travelServices, 'travel')}
            </div>
        </section>
    );
};

export default Services;
