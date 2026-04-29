import React from 'react';

/**
 * OptimizedImage Component
 * Handles responsive images with WebP support and lazy loading.
 * 
 * @param {string} src - Path to the image (e.g., /images/hero/spa.jpg)
 * @param {string} alt - Alternative text for accessibility
 * @param {string} className - Optional CSS classes
 * @param {boolean} priority - If true, image will be eager-loaded (for LCP)
 */
export const OptimizedImage = ({ src, alt, className, priority = false }) => {
    // Generate base path by removing extension
    const base = src.replace(/\.(webp|jpg|jpeg|png)$/, '');
    
    return (
        <picture className={className}>
            {/* Primary WebP source */}
            <source 
                srcSet={`${base}.webp`} 
                type="image/webp" 
            />
            {/* Fallback source */}
            <img
                src={src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className={className}
            />
        </picture>
    );
};

export default OptimizedImage;
