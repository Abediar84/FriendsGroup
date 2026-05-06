import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeIn } from '../styles/animations';
import { MapPin, Star, Waves, ArrowRight } from 'lucide-react';
import OptimizedImage from '../components/common/OptimizedImage';
import './Services.css';

// Spa Assets
import serviceSpa from '../assets/images/programs/service_spa.png';
import redSeaImg from '../assets/images/programs/red_sea_spa.png';
import paradiseImg from '../assets/images/programs/paradise_spa.png';
import hammamImg from '../assets/images/programs/egyptian_hammam.png';
import vipImg from '../assets/images/programs/vip_wellness.png';

import hotelGiftun from '../assets/images/hotels/giftun_azur.png';
import hotelMarriott from '../assets/images/offers/Hurghada_Marriott_Red_Sea_Resort.png';
import hotelSkyView from '../assets/images/offers/Sky_View_Hurghada.png';
import hotelLemon from '../assets/images/offers/LemonSoul_Makadi_Garden.png';
const hotelAzal = 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200'; // High-end North Coast feel

const Services = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('spa');

    // ─── SPA PROGRAMS ──────────────────────────────────────────────
    const spaServices = [
        { id: 'red_sea', img: redSeaImg },
        { id: 'paradise', img: paradiseImg },
        { id: 'hammam', img: hammamImg },
        { id: 'vip', img: vipImg }
    ];

    // ─── HOTEL PARTNERS ────────────────────────────────────────────
    const hotels = [
        {
            id: 'giftun',
            name: t('services.hotel_list.giftun.name'),
            location: t('services.hotel_list.giftun.location'),
            img: hotelGiftun,
            stars: 4,
            badge: t('services.hotel_list.giftun.badge'),
            features: t('services.hotel_list.giftun.features', { returnObjects: true }),
            desc: t('services.hotel_list.giftun.desc'),
        },
        {
            id: 'marriott',
            name: t('services.hotel_list.marriott.name'),
            location: t('services.hotel_list.marriott.location'),
            img: hotelMarriott,
            stars: 5,
            badge: t('services.hotel_list.marriott.badge'),
            features: t('services.hotel_list.marriott.features', { returnObjects: true }),
            desc: t('services.hotel_list.marriott.desc'),
        },
        {
            id: 'skyview',
            name: t('services.hotel_list.skyview.name'),
            location: t('services.hotel_list.skyview.location'),
            img: hotelSkyView,
            stars: 4,
            badge: t('services.hotel_list.skyview.badge'),
            features: t('services.hotel_list.skyview.features', { returnObjects: true }),
            desc: t('services.hotel_list.skyview.desc'),
        },
        {
            id: 'lemon',
            name: t('services.hotel_list.lemon.name'),
            location: t('services.hotel_list.lemon.location'),
            img: hotelLemon,
            stars: 4,
            badge: t('services.hotel_list.lemon.badge'),
            features: t('services.hotel_list.lemon.features', { returnObjects: true }),
            desc: t('services.hotel_list.lemon.desc'),
        },
        {
            id: 'azal',
            name: t('services.hotel_list.azal.name'),
            location: t('services.hotel_list.azal.location'),
            img: hotelAzal,
            stars: 5,
            badge: t('services.hotel_list.azal.badge'),
            features: t('services.hotel_list.azal.features', { returnObjects: true }),
            desc: t('services.hotel_list.azal.desc'),
        },
    ];

    const renderStars = (count) => (
        <div className="hotel-stars">
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
            ))}
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

                {/* ── Tab Toggle ── */}
                <div className="services-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'spa' ? 'active' : ''}`}
                        onClick={() => setActiveTab('spa')}
                    >
                        {t('services.spa.category')}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hotels')}
                    >
                        {t('services.travel.category')}
                    </button>
                </div>

                {/* ── SPA GRID ── */}
                {activeTab === 'spa' && (
                    <div className="services-category-block">
                        <div className="services-grid">
                            {spaServices.map((service, index) => (
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
                                        <OptimizedImage
                                            src={service.img}
                                            alt={t(`services.spa.${service.id}.title`)}
                                            className="service-img"
                                        />
                                        <div className="img-overlay"></div>
                                    </div>
                                    <div className="service-info">
                                        <h4 className="service-name">{t(`spa_menu.programs.${service.id}.name`)}</h4>
                                        <ul className="service-treatments">
                                            {t(`spa_menu.programs.${service.id}.items`, { returnObjects: true }).map((tr, i) => (
                                                <li key={i}>{tr}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div 
                            className="services-footer-cta"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Link to="/menu" className="btn-digital-menu">
                                {t('spa_menu.title')} <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                )}

                {/* ── HOTELS GRID ── */}
                {activeTab === 'hotels' && (
                    <div className="services-category-block">
                        <p className="hotels-intro">{t('services.hotels.intro')}</p>
                        <div className="hotels-grid">
                            {hotels.map((hotel, index) => (
                                <motion.div
                                    key={hotel.id}
                                    className={`hotel-card interactive ${hotel.id === 'azal' ? 'coming-soon' : ''}`}
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 1.2,
                                        ease: [0.2, 0, 0.2, 1],
                                        delay: index * 0.1
                                    }}
                                    viewport={{ once: true, margin: "-80px" }}
                                >
                                    <div className="hotel-img-wrapper">
                                        <OptimizedImage
                                            src={hotel.img}
                                            alt={hotel.name}
                                            className="hotel-img"
                                        />
                                        <div className="hotel-badge">{hotel.badge}</div>
                                        <div className="hotel-overlay"></div>
                                    </div>
                                    <div className="hotel-info">
                                        {renderStars(hotel.stars)}
                                        <h4 className="hotel-name">{hotel.name}</h4>
                                        <div className="hotel-location">
                                            <MapPin size={14} />
                                            <span>{hotel.location}</span>
                                        </div>
                                        <p className="hotel-desc">{hotel.desc}</p>
                                        <div className="hotel-features">
                                            {hotel.features.map((f, i) => (
                                                <span key={i} className="feature-tag">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;
