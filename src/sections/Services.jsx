import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeIn } from '../styles/animations';
import { MapPin, Star, Wifi, Waves, ArrowRight } from 'lucide-react';
import './Services.css';

// Spa Assets
import serviceSpa from '../assets/images/service_spa.png';
import redSeaImg from '../assets/spa/red_sea_spa.png';
import paradiseImg from '../assets/spa/paradise_spa.png';
import hammamImg from '../assets/spa/egyptian_hammam.png';
import vipImg from '../assets/spa/vip_wellness.png';

import hotelGiftun from '../assets/images/hotels/giftun_azur.png';

// Helper to resolve images robustly across dev/prod
const resolveOfferImage = (imgName) => {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const safeName = imgName.replace(/&/g, '%26');
  return `${cleanBase}offers/${safeName}`;
};

const hotelMarriott = resolveOfferImage("Hurghada_Marriott_Red_Sea_Resort.png");
const hotelSkyView = resolveOfferImage("Sky_View_Hurghada.png");
const hotelLemon = resolveOfferImage("Lemon&Soul_Makadi_Garden.png");
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
            name: 'Giftun Azur Hurghada',
            location: 'Hurghada, Red Sea',
            img: hotelGiftun,
            stars: 4,
            badge: 'Partner Hotel',
            features: ['Private Beach', 'Coral Reefs', 'All-Inclusive'],
            desc: 'A legendary Hurghada landmark offering authentic Red Sea hospitality with pristine sandy beaches and turquoise waters.',
        },
        {
            id: 'marriott',
            name: 'Marriott Hurghada',
            location: 'Hurghada, Red Sea',
            img: hotelMarriott,
            stars: 5,
            badge: 'International Luxury',
            features: ['Private Island', 'Sea View Rooms', 'Elite Service'],
            desc: 'Exceptional five-star luxury featuring a private island, world-class dining, and unparalleled service in the heart of Hurghada.',
        },
        {
            id: 'skyview',
            name: 'Sky View Hurghada',
            location: 'Hurghada, Red Sea',
            img: hotelSkyView,
            stars: 4,
            badge: 'Modern Comfort',
            features: ['Rooftop Pool', 'City Center', 'Panoramic Views'],
            desc: 'Modern sophistication meeting Red Sea charm. Enjoy panoramic views from the rooftop and premium city-center convenience.',
        },
        {
            id: 'lemon',
            name: 'Lemon & Soul Hurghada',
            location: 'Hurghada, Red Sea',
            img: hotelLemon,
            stars: 4,
            badge: 'Boutique Vibes',
            features: ['Vibrant Decor', 'Adults Only', 'Unique Style'],
            desc: 'A vibrant boutique experience with a focus on soul and style. Perfect for those seeking a fresh, colorful getaway.',
        },
        {
            id: 'azal',
            name: 'Azal North Coast',
            location: 'El Alamein, North Coast',
            img: hotelAzal,
            stars: 5,
            badge: 'Coming Soon',
            features: ['Mediterranean Shore', 'Luxury Villas', 'Exclusive Access'],
            desc: 'A new horizon of Mediterranean luxury. Experience the pristine white sands and crystal-clear waters of the North Coast.',
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
                                        <img
                                            src={service.img}
                                            alt={t(`services.spa.${service.id}.title`)}
                                            className="service-img"
                                            loading="lazy"
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
                                        <a href="#booking" className="btn-service-cta">{t('services.cta')}</a>
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
                                        <img
                                            src={hotel.img}
                                            alt={hotel.name}
                                            className="hotel-img"
                                            loading="lazy"
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
                                        <a
                                            href={hotel.id === 'azal' ? '#contact' : '#booking'}
                                            className={`btn-service-cta ${hotel.id === 'azal' ? 'btn-notify' : ''}`}
                                        >
                                            {hotel.id === 'azal' ? 'Get Notified' : t('services.cta')}
                                        </a>
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
