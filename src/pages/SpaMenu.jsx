import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Waves, 
  Sparkles, 
  Flame, 
  Crown, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Clock,
  Instagram,
  Facebook,
  Globe
} from 'lucide-react';
import './SpaMenu.css';

// Import images
import redSeaImg from '../assets/spa/red_sea_spa.png';
import paradiseImg from '../assets/spa/paradise_spa.png';
import hammamImg from '../assets/spa/egyptian_hammam.png';
import vipImg from '../assets/spa/vip_wellness.png';

const SpaMenu = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const programs = [
    {
      id: 'red_sea',
      icon: <Waves className="program-icon" />,
      image: redSeaImg,
      key: 'red_sea'
    },
    {
      id: 'paradise',
      icon: <Sparkles className="program-icon" />,
      image: paradiseImg,
      key: 'paradise'
    },
    {
      id: 'hammam',
      icon: <Flame className="program-icon" />,
      image: hammamImg,
      key: 'hammam'
    },
    {
      id: 'vip',
      icon: <Crown className="program-icon" />,
      image: vipImg,
      key: 'vip'
    }
  ];

  const massages = ['medical', 'sporty', 'relaxing', 'hot_stone'];

  return (
    <div className={`spa-menu-page ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="menu-nav">
        <div className="menu-nav-content">
          <Link to="/" className="menu-logo">
            <span className="logo-text">FRIENDS GROUP</span>
            <span className="logo-sub">SPA & BEAUTY</span>
          </Link>
          
          <div className="nav-actions">
            <button onClick={toggleLanguage} className="lang-toggle-btn">
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>
            <Link to="/" className="visit-site-btn">
              {t('nav.home')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="menu-hero">
        <motion.div 
          className="hero-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="hero-content">
          <motion.span 
            className="hero-eyebrow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('services.spa.category')}
          </motion.span>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('spa_menu.title')}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t('spa_menu.subtitle')}
          </motion.p>
        </div>
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="mouse" />
        </motion.div>
      </header>

      {/* Programs Section */}
      <section className="programs-section">
        <div className="section-header">
          <h2>{t('spa_menu.programs_title')}</h2>
          <div className="divider" />
        </div>

        <div className="programs-grid">
          {programs.map((program, index) => (
            <motion.div 
              key={program.id}
              className="program-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-image-container">
                <img src={program.image} alt={t(`spa_menu.programs.${program.key}.name`)} />
                <div className="image-overlay" />
                <div className="card-icon-box">{program.icon}</div>
              </div>
              <div className="card-content">
                <h3>{t(`spa_menu.programs.${program.key}.name`)}</h3>
                <ul className="program-items">
                  {t(`spa_menu.programs.${program.key}.items`, { returnObjects: true }).map((item, i) => (
                    <li key={i}>
                      <span className="dot" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Massage Therapy Section */}
      <section className="massages-section">
        <div className="massages-bg-text">MASSAGE</div>
        <div className="container">
          <div className="massages-content">
            <div className="text-side">
              <h2>{t('spa_menu.massages_title')}</h2>
              <p className="massages-intro">
                Our expert therapists use specialized techniques to restore balance to your body and mind.
              </p>
              
              <div className="massage-list">
                {massages.map((m, i) => (
                  <motion.div 
                    key={m}
                    className="massage-item"
                    initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="massage-number">0{i + 1}</span>
                    <span className="massage-name">{t(`spa_menu.massages.${m}`)}</span>
                  </motion.div>
                ))}
              </div>

              <div className="booking-cta-box">
                <p>Ready for relaxation?</p>
                <a href={`https://wa.me/201207776033`} target="_blank" rel="noopener noreferrer" className="cta-btn">
                  {t('booking.form.whatsapp')}
                </a>
              </div>
            </div>
            
            <div className="image-side">
              <motion.div 
                className="massage-image-frame"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80" alt="Massage Therapy" />
                <div className="frame-border" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location Footer */}
      <footer className="menu-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-text">FRIENDS GROUP</span>
            <p>Luxury Spa & Travel Services Since 2003</p>
          </div>
          
          <div className="footer-info-grid">
            <div className="info-item">
              <MapPin size={20} className="info-icon" />
              <div>
                <h4>{t('contact.info.address_label')}</h4>
                <p>{t('contact.info.address_val')}</p>
              </div>
            </div>
            
            <div className="info-item">
              <Phone size={20} className="info-icon" />
              <div>
                <h4>{t('contact.info.phone_label')}</h4>
                <p>{t('contact.info.phone_val')}</p>
              </div>
            </div>
            
            <div className="info-item">
              <Clock size={20} className="info-icon" />
              <div>
                <h4>{t('contact.info.hours_label')}</h4>
                <p>{t('contact.info.hours_val')}</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="social-links">
              <a href="#" className="social-link"><Instagram size={20} /></a>
              <a href="#" className="social-link"><Facebook size={20} /></a>
              <a href="#" className="social-link"><Globe size={20} /></a>
            </div>
            <p className="copyright">© {new Date().getFullYear()} Friends Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpaMenu;
