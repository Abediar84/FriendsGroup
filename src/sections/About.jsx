import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import { Building2, Star, Trophy, Shield } from 'lucide-react';
import './About.css';
import aboutOffice from '../assets/images/about_office.png';

const About = () => {
    const { t } = useLanguage();

    const pillars = [
        { key: 'management', icon: <Building2 strokeWidth={1.5} /> },
        { key: 'quality', icon: <Star strokeWidth={1.5} /> },
        { key: 'excellence', icon: <Trophy strokeWidth={1.5} /> },
        { key: 'reliability', icon: <Shield strokeWidth={1.5} /> }
    ];

    return (
        <section id="about" className="about-section refined">
            <div className="about-bg-text">EST. 2003</div>
            
            <div className="container about-container">
                <motion.div
                    className="about-story"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.5, ease: [0.2, 0, 0.2, 1] }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <span className="about-subtitle">{t('about.subtitle')}</span>
                    <h2 className="about-title">{t('about.story_heading')}</h2>
                    <p className="about-text">{t('about.story_content')}</p>

                    <div className="about-pillars">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={pillar.key}
                                className="pillar-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ 
                                    duration: 1, 
                                    delay: 0.5 + (index * 0.1), 
                                    ease: [0.2, 0, 0.2, 1] 
                                }}
                            >
                                <div className="pillar-icon">{pillar.icon}</div>
                                <div className="pillar-info">
                                    <h4>{t(`about.${pillar.key}.title`)}</h4>
                                    <p>{t(`about.${pillar.key}.desc`)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <a href="#contact" className="btn btn-outline">{t('nav.contact')}</a>
                </motion.div>

                <motion.div
                    className="about-visual"
                    initial={{ opacity: 0, scale: 1.05 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: [0.2, 0, 0.2, 1] }}
                    viewport={{ once: true }}
                >
                    <div className="image-wrapper">
                        <img
                            src={aboutOffice}
                            alt="Corporate Office Luxury"
                        />
                        <div className="experience-badge">
                            <span className="years">2003</span>
                            <span className="label">Legacy of Excellence</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
