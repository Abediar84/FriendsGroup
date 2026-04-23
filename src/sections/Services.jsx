import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import { MapPin, Star, Wifi, Waves } from 'lucide-react';
import './Services.css';

// Spa Assets
import serviceSpa from '../assets/images/service_spa.png';
import serviceVip from '../assets/images/programs/vip_wellness.png';

// Hotel Assets (local for 3, Unsplash fallback for 2)
import hotelGiftun from '../assets/images/hotels/giftun_azur.png';
import hotelMarriott from '../assets/images/hotels/marriott_hurghada.png';
import hotelSkyView from '../assets/images/hotels/sky_view_hurghada.png';

const Services = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('spa');

    // ─── SPA PROGRAMS ──────────────────────────────────────────────
    const spaServices = [
        {
            id: 'massage',
            img: serviceSpa,
            treatments: ['Swedish Relaxation', 'Deep Tissue', 'Hot Candle Wax', 'Aromatherapy', 'Four Hands']
        },
        {
            id: 'body',
            img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=2070',
            treatments: ['Volcanic Hot Stones', 'Deep Muscle Relief', 'Detox Ritual']
        },
        {
            id: 'bath',
            img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
            treatments: ['Traditional Hammam Scrub', 'Clay Mask', 'Milk & Honey Soak']
        },
        {
            id: 'sauna',
            img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=2070',
            treatments: ['Dry Finnish Sauna', 'Steam Room', 'Cold Plunge']
        },
        {
            id: 'gym',
            img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2070',
            treatments: ['Cardio Zone', 'Free Weights', 'Personal Training']
        },
        {
            id: 'packages',
            img: serviceVip,
            treatments: ['Full Day Retreat', 'Couples VIP', 'Executive Wellness']
        }
    ];

    // ─── HOTEL PARTNERS ────────────────────────────────────────────
    const hotels = [
        {
            id: 'giftun',
            name: 'Giftun Azur Resort',
            location: 'Hurghada, Red Sea',
            img: hotelGiftun,
            stars: 4,
            badge: 'Partner Hotel',
            features: ['Beachfront', 'Pool', 'Spa Access'],
            desc: 'A premier Red Sea beachfront resort with pristine private beach, turquoise waters, and a relaxed luxury atmosphere.',
        },
        {
            id: 'marriott',
            name: 'Marriott Beach Resort',
            location: 'Hurghada, Red Sea',
            img: hotelMarriott,
            stars: 5,
            badge: '5-Star',
            features: ['Private Beach', 'Fine Dining', 'Infinity Pool'],
            desc: 'World-class five-star hospitality on the shores of the Red Sea with exceptional dining and premium amenities.',
        },
        {
            id: 'skyview',
            name: 'Sky View Hotel',
            location: 'Hurghada, Red Sea',
            img: hotelSkyView,
            stars: 4,
            badge: 'City Views',
            features: ['Rooftop Pool', 'Sea Views', 'Modern Design'],
            desc: 'A contemporary hotel featuring stunning panoramic views of Hurghada and the Red Sea from its rooftop infinity pool.',
        },
        {
            id: 'lemon',
            name: 'Lemon & Soul',
            location: 'Makadi Bay, Hurghada',
            img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200',
            stars: 4,
            badge: 'Boutique',
            features: ['Tropical Gardens', 'Makadi Bay', 'Vibrant Atmosphere'],
            desc: 'A vibrant and stylish boutique resort nestled in Makadi Bay, with lush tropical gardens and a lively, colourful design.',
        },
        {
            id: 'azal',
            name: 'Azal North Coast',
            location: 'North Coast, Egypt',
            img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
            stars: 5,
            badge: 'Coming Soon',
            features: ['Mediterranean Coast', 'Private Beach', 'Luxury Villas'],
            desc: 'An upcoming luxury coastal retreat on Egypt\'s stunning Mediterranean North Coast. Opening soon exclusively for Friends Group clients.',
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
                                        <h4 className="service-name">{t(`services.spa.${service.id}.title`)}</h4>
                                        <p className="service-desc">{t(`services.spa.${service.id}.desc`)}</p>
                                        {service.treatments && (
                                            <ul className="service-treatments">
                                                {service.treatments.map((tr, i) => (
                                                    <li key={i}>{tr}</li>
                                                ))}
                                            </ul>
                                        )}
                                        <a href="#booking" className="btn-service-cta">{t('services.cta')}</a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
