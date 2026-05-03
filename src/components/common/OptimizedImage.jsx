import React from 'react';

/**
 * OptimizedImage Component
 * Handles responsive images with lazy loading.
 * 
 * @param {string} src - Path to the image
 * @param {string} alt - Alternative text for accessibility
 * @param {string} className - Optional CSS classes
 * @param {boolean} priority - If true, image will be eager-loaded (for LCP)
 */
const OptimizedImage = ({ src, alt, className, priority = false }) => {
    return (
        <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={className}
        />
    );
};

export default OptimizedImage;
