import React, { useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();
    const containerRef = useRef(null);
    
    // Parallax logic for desktop
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]); // Parallax for background images
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]); // Parallax for content
    const opacity = useTransform(scrollY, [0, 800], [1, 0]); // Fade out on scroll

    return (
        <section id="home" className="hero-section cinematic" ref={containerRef}>
            <motion.div
                className="hero-split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.2, 0, 0.2, 1] }}
                style={{ opacity }}
            >
                <div className="hero-pane travel-pane">
                    <motion.div
                        className="pane-image"
                        initial={{ scale: 1.1, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        style={{ y: y1 }}
                    ></motion.div>
                    <div className="pane-overlay"></div>
                </div>
                <div className="hero-pane spa-pane">
                    <motion.div
                        className="pane-image"
                        initial={{ scale: 1.1, x: 20 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ duration: 3, ease: "easeOut", delay: 0.2 }}
                        style={{ y: y1 }}
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
                    style={{ y: y2 }}
                >
                    <span className="hero-pretitle">{t('hero.since_2003')}</span>
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
