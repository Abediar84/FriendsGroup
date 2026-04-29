import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Users, Users2, Waves, Sun, Heart, CheckCircle2 } from 'lucide-react';
import './SpecialOffers.css';

const SpecialOffers = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // Helper to resolve images robustly across dev/prod
    const resolveOfferImage = (imgName) => {
      const base = import.meta.env.BASE_URL || "/";
      const cleanBase = base.endsWith("/") ? base : `${base}/`;
      const safeName = imgName.replace(/&/g, '%26');
      return `${cleanBase}offers/${safeName}`;
    };

    const offers = [
        {
            id: 'marriott',
            hotel: "Hurghada Marriott Red Sea Resort",
            type: "Hard All-Inclusive",
            period: "25/04 - 26/05/2026",
            image: resolveOfferImage("Hurghada_Marriott_Red_Sea_Resort.png"),
            prices: [
                { label: "Single", price: 8200, icon: <User size={18} /> },
                { label: "Double", price: 8800, icon: <Users size={18} /> },
                { label: "Triple", price: 11800, icon: <Users2 size={18} /> }
            ],
            kids: [
                "1st Child (up to 11.99): FREE",
                "Extra Child (1.99 - 11.99): 2800 LE / Night"
            ],
            extras: [
                { label: "Sea View Upgrade", price: 300 }
            ],
            badge: "Luxury Choice"
        },
        {
            id: 'skyview',
            hotel: "Sky View Hurghada",
            type: "Full Board",
            period: "25/04 - 26/05/2026",
            image: resolveOfferImage("Sky_View_Hurghada.png"),
            prices: [
                { label: "Single", price: 4200, icon: <User size={18} /> },
                { label: "Double", price: 4800, icon: <Users size={18} /> }
            ],
            kids: [
                "1st Child (up to 11.99): FREE",
                "Extra Child (1.99 - 11.99): 1200 LE / Night"
            ],
            badge: "Best Value"
        },
        {
            id: 'lemonsoul',
            hotel: "Lemon & Soul Makadi Garden",
            type: "Hard All-Inclusive",
            periods: [
                { dates: "20/04 - 26/05", s: 4000, d: 5200 },
                { dates: "27/05 - 01/06", s: 4200, d: 5500 },
                { dates: "01/06 - 30/06", s: 4050, d: 5300 }
            ],
            image: resolveOfferImage("Lemon&Soul_Makadi_Garden.png"),
            kids: [
                "1st Child (up to 11.99): FREE",
                "Max Capacity: 2+1 or 1+2"
            ],
            badge: "Vibrant Stay"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.2, 0, 0.2, 1] }
        }
    };

    return (
        <section id="special-offers" className="special-offers">
            <div className="section-header">
                <motion.span 
                    initial={{ opacity: 0, letterSpacing: "0.1em" }}
                    whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                    className="eyebrow"
                >
                    {t('offers.eyebrow', 'SUMMER 2026 EXCLUSIVES')}
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="section-title"
                >
                    {t('offers.title', 'Limited Time Promotions')}
                </motion.h2>
                <div className="title-accent"></div>
            </div>

            <motion.div 
                className="offers-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {offers.map((offer) => (
                    <motion.div 
                        key={offer.id} 
                        className="offer-card"
                        variants={itemVariants}
                    >
                        <div className="offer-image-container">
                            <img src={offer.image} alt={offer.hotel} className="offer-image" />
                            <div className="offer-overlay"></div>
                            <div className="offer-badge">{offer.badge}</div>
                            <div className="offer-type">
                                <Sun size={14} />
                                <span>{offer.type}</span>
                            </div>
                        </div>

                        <div className="offer-content">
                            <h3 className="hotel-name">{offer.hotel}</h3>
                            
                            {offer.period && (
                                <div className="offer-period">
                                    <Calendar size={14} />
                                    <span>{offer.period}</span>
                                </div>
                            )}

                            <div className="price-tiers">
                                {offer.prices ? (
                                    offer.prices.map((p, idx) => (
                                        <div key={idx} className="price-item">
                                            <div className="price-label">
                                                {p.icon}
                                                <span>{p.label}</span>
                                            </div>
                                            <div className="price-value">
                                                <span className="currency">LE</span>
                                                <span className="amount">{p.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="period-tiers">
                                        {offer.periods.map((per, idx) => (
                                            <div key={idx} className="period-row">
                                                <div className="period-dates">{per.dates}</div>
                                                <div className="period-prices">
                                                    <div className="p-val">S: {per.s}</div>
                                                    <div className="p-val">D: {per.d}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="offer-details">
                                <div className="detail-group">
                                    <h4>{t('offers.kids_policy', 'Family Policy')}</h4>
                                    <ul>
                                        {offer.kids.map((k, idx) => (
                                            <li key={idx}>
                                                <CheckCircle2 size={12} className="check-icon" />
                                                <span>{k}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {offer.extras && (
                                    <div className="detail-group">
                                        <h4>{t('offers.extras', 'Available Upgrades')}</h4>
                                        {offer.extras.map((ex, idx) => (
                                            <div key={idx} className="extra-item">
                                                <span>{ex.label}</span>
                                                <span className="extra-price">+{ex.price} LE</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button 
                                className="book-btn"
                                onClick={() => {
                                    const msg = `Interested in ${offer.hotel} Summer 2026 Offer`;
                                    window.open(`https://wa.me/201207776033?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                            >
                                {t('offers.book_now', 'Secure This Offer')}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div 
                className="marketing-note"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <p>{t('offers.disclaimer', '* All prices are per night. Limited availability for Summer 2026.')}</p>
            </motion.div>
        </section>
    );
};

export default SpecialOffers;
