import React, { useState, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Gallery.css';

const galleryItems = [
    { id: 1, category: 'spa', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200', size: 'large' },
    { id: 2, category: 'travel', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', size: 'small' },
    { id: 3, category: 'spa', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', size: 'medium' },
    { id: 4, category: 'travel', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200', size: 'large' },
    { id: 5, category: 'spa', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', size: 'small' },
    { id: 6, category: 'travel', img: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&q=80&w=800', size: 'medium' },
    { id: 7, category: 'spa', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', size: 'small' },
    { id: 8, category: 'travel', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200', size: 'large' },
];

const Gallery = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all');
    const [selectedImg, setSelectedImg] = useState(null);

    const filteredItems = useMemo(() => {
        if (filter === 'all') return galleryItems;
        return galleryItems.filter(item => item.category === filter);
    }, [filter]);

    return (
        <section id="gallery" className="gallery-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    variants={fadeIn('down', 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                >
                    <span className="section-label">{t('gallery.title')}</span>
                    <h2 className="section-title">{t('gallery.title')}</h2>
                    <p className="section-subtitle">{t('gallery.subtitle')}</p>
                </motion.div>

                <div className="gallery-filters">
                    {['all', 'spa', 'travel'].map((f) => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {t(`gallery.filters.${f}`)}
                        </button>
                    ))}
                </div>

                <motion.div
                    layout
                    className="gallery-grid"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                className={`gallery-item ${item.size}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => setSelectedImg(item.img)}
                            >
                                <img src={item.img} alt={`Gallery ${item.id}`} loading="lazy" />
                                <div className="gallery-overlay">
                                    <span className="overlay-icon"><Maximize2 size={32} /></span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        className="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                    >
                        <motion.div
                            className="lightbox-content"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selectedImg} alt="Enlarged" />
                            <button className="close-btn" onClick={() => setSelectedImg(null)}>&times;</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
