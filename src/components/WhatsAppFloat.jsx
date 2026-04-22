import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import './WhatsAppFloat.css';

const WA_NUMBER = '201207776033';
const MESSAGES = {
    en: "Hello, I'd like to inquire about Friends Group services.",
    ar: 'مرحباً، أريد الاستفسار عن خدمات فريندز جروب.',
};

const WhatsAppFloat = () => {
    const { language } = useLanguage();
    const [visible, setVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Only show button after scrolling past the hero
    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const msg = MESSAGES[language] || MESSAGES.en;
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="wa-float-wrapper"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {/* Tooltip */}
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                className="wa-tooltip"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {language === 'ar' ? 'تحدث معنا الآن' : 'Chat with us now'}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wa-float-btn"
                        aria-label="Chat on WhatsApp"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                    >
                        {/* WhatsApp SVG icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            width="28"
                            height="28"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.478.648 4.897 1.88 7.022L2 30l7.22-1.854A13.955 13.955 0 0016.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm0 25.6a11.563 11.563 0 01-5.89-1.605l-.424-.25-4.286 1.1 1.12-4.183-.278-.443A11.556 11.556 0 014.4 16.003C4.4 9.6 9.6 4.4 16.003 4.4c6.397 0 11.597 5.2 11.597 11.603 0 6.396-5.2 11.597-11.597 11.597zm6.364-8.68c-.35-.175-2.066-1.017-2.386-1.133-.32-.117-.554-.175-.787.175-.232.35-.9 1.133-1.105 1.367-.203.234-.408.263-.757.088-.35-.175-1.474-.543-2.808-1.73-1.038-.924-1.738-2.066-1.942-2.415-.204-.35-.022-.538.153-.713.157-.157.35-.408.525-.612.175-.204.233-.35.35-.583.117-.234.058-.438-.029-.612-.088-.175-.787-1.895-1.08-2.595-.284-.682-.574-.589-.787-.6l-.67-.012a1.284 1.284 0 00-.93.438c-.32.35-1.22 1.192-1.22 2.908s1.25 3.375 1.424 3.608c.175.233 2.46 3.754 5.958 5.264.833.36 1.483.574 1.99.735.835.265 1.596.228 2.197.138.67-.1 2.066-.844 2.358-1.66.292-.815.292-1.515.204-1.66-.088-.146-.32-.234-.67-.41z"/>
                        </svg>
                    </motion.a>

                    {/* Ping ring animation */}
                    <span className="wa-ping" aria-hidden="true" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WhatsAppFloat;
