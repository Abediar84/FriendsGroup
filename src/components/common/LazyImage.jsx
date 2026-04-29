import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LazyImage.css';

/**
 * LazyImage Component
 * Shows a shimmer skeleton while the image is loading, then fades in the image.
 */
export const LazyImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`lazy-image-container ${className}`}>
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="image-skeleton"
                    />
                )}
            </AnimatePresence>
            
            <motion.img
                src={src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onLoad={() => setIsLoaded(true)}
                className={`actual-image ${isLoaded ? 'loaded' : ''}`}
                loading="lazy"
            />
        </div>
    );
};

export default LazyImage;
