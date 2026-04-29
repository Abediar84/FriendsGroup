import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Only enable on devices with a fine pointer (mouse)
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        if (!hasFinePointer) return;

        setIsVisible(true);
        
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleHover = (e) => {
            if (e.target.closest('a, button, .interactive')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <>
            <motion.div
                className="cursor-dot"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                }}
            />
            <motion.div
                className={`cursor-outline ${isHovering ? 'hovering' : ''}`}
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    opacity: isHovering ? 0.15 : 0.4,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
        </>
    );
};

export default CustomCursor;
