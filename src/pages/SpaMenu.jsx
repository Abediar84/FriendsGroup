import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
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
  Globe,
  Gem,
  Thermometer
} from 'lucide-react';
import CustomCursor from '../components/CustomCursor';
import WhatsAppFloat from '../components/WhatsAppFloat';
import './SpaMenu.css';

import logo from '../assets/logo.png';

// Import images
import redSeaImg from '../assets/spa/red_sea_spa.png';
import paradiseImg from '../assets/spa/paradise_spa.png';
import hammamImg from '../assets/spa/egyptian_hammam.png';
import vipImg from '../assets/spa/vip_wellness.png';

const SpaMenu = () => {
  const { t, language, setLanguage } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const programs = [
    { id: 'red_sea', icon: <Waves className="program-icon" />, image: redSeaImg, key: 'red_sea' },
    { id: 'paradise', icon: <Sparkles className="program-icon" />, image: paradiseImg, key: 'paradise' },
    { id: 'hammam', icon: <Flame className="program-icon" />, image: hammamImg, key: 'hammam' },
    { id: 'vip', icon: <Gem className="program-icon" />, image: vipImg, key: 'vip' }
  ];

  const massages = ['medical', 'sporty', 'relaxing', 'hot_stone'];
  const saunaPackages = ['full', 'half', 'single'];

  return (
    <div className={`spa-menu-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="noise-overlay" />
      <CustomCursor />
      <WhatsAppFloat />
      
      {/* Navigation */}
      <nav className="menu-nav">
        <div className="menu-nav-content">
          <Link to="/" className="menu-logo-brand">
            <img src={logo} alt="Friends Group" className="brand-logo-img" />
          </Link>
          
          <div className="nav-actions">
            <button onClick={toggleLanguage} className="lang-toggle-btn">
              {language === 'en' ? 'العربية' : 'English'}
            </button>
            <Link to="/" className="visit-site-btn">
              {t('nav.home')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="menu-hero cinematic">
        <div className="hero-split">
          <div className="hero-pane">
            <motion.div 
              className="pane-image"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3 }}
            />
            <div className="pane-overlay" />
          </div>
          <div className="hero-texture-overlay" />
        </div>

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
        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
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
                  {(t(`spa_menu.programs.${program.key}.items`) || []).map((item, i) => (
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
                {language === 'en' ? 'Our expert therapists use specialized techniques to restore balance to your body and mind.' : 'يستخدم معالجونا الخبراء تقنيات متخصصة لاستعادة التوازن لجسمك وعقلك.'}
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

      {/* Sauna & Steam Section */}
      <section className="sauna-section">
        <div className="container">
          <div className="sauna-grid">
            <div className="sauna-info">
              <div className="sauna-icon-box">
                <Thermometer size={48} strokeWidth={1} />
              </div>
              <h2>{t('spa_menu.sauna.title')}</h2>
              <p>{language === 'en' ? 'Detoxify and relax with our premium heat treatments.' : 'تخلص من السموم واسترخِ مع علاجات الحرارة الممتازة لدينا.'}</p>
            </div>
            <div className="sauna-packages">
              {saunaPackages.map((pkg, idx) => (
                <div key={pkg} className="sauna-pkg-card">
                  <div className="pkg-dot" />
                  <span className="pkg-name">{t(`spa_menu.sauna.${pkg}`)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="booking-cta-box-horizontal">
            <h3>{language === 'en' ? 'Ready for your rejuvenation?' : 'هل أنت مستعد لتجديد شبابك؟'}</h3>
            <a href={`https://wa.me/201207776033`} target="_blank" rel="noopener noreferrer" className="cta-btn">
              {t('booking.form.whatsapp')}
            </a>
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
