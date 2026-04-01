import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="home" className="hero-section cinematic">
            <motion.div
                className="hero-split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.2, 0, 0.2, 1] }}
            >
                <div className="hero-pane travel-pane">
                    <motion.div
                        className="pane-image"
                        initial={{ scale: 1.1, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                    ></motion.div>
                    <div className="pane-overlay"></div>
                </div>
                <div className="hero-pane spa-pane">
                    <motion.div
                        className="pane-image"
                        initial={{ scale: 1.1, x: 20 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ duration: 3, ease: "easeOut", delay: 0.2 }}
                    ></motion.div>
                    <div className="pane-overlay"></div>
                </div>
                <div className="hero-texture-overlay"></div>
            </motion.div>

            <div className="container hero-container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1], delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <span className="hero-pretitle">20 Years of Excellence</span>
                    <h1 className="hero-title">{t('hero.title')}</h1>
                    <p className="hero-subtitle">{t('hero.subtitle')}</p>
                    <div className="hero-btns">
                        <a href="#services" className="btn btn-primary">{t('hero.spa_cta')}</a>
                        <a href="#contact" className="btn btn-outline">{t('hero.travel_cta')}</a>
                    </div>
                </motion.div>
            </div>

            <div className="scroll-indicator">
                <div className="mouse">
                    <div className="wheel"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
