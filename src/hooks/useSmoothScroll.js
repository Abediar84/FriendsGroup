import { useEffect } from 'react';
import Lenis from 'lenis';

export const useSmoothScroll = () => {
    useEffect(() => {
        // Disable Lenis on mobile — native scroll is better on touch devices
        // and Lenis can conflict with iOS Safari's address bar collapse
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothHorizontal: false,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);
};
