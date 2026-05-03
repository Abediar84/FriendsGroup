import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 35, stiffness: 400, mass: 0.8 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Strict desktop detection
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        if (!hasFinePointer) {
            setIsVisible(false);
            return;
        }

        setIsVisible(true);
        
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleHover = (e) => {
            const target = e.target.closest('a, button, .interactive, select, input');
            if (target) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleLeave = () => setIsVisible(false);
        const handleEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);
        window.addEventListener('mouseleave', handleLeave);
        window.addEventListener('mouseenter', handleEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
            window.removeEventListener('mouseleave', handleLeave);
            window.removeEventListener('mouseenter', handleEnter);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <div className="custom-cursor-wrapper">
            <motion.div
                className="cursor-dot"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
            />
            <motion.div
                className={`cursor-outline ${isHovering ? 'hovering' : ''}`}
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
                animate={{
                    scale: isHovering ? 2.2 : 1,
                    opacity: isHovering ? 0.2 : 0.4,
                    borderWidth: isHovering ? '1px' : '2px'
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            />
        </div>
    );
};

export default CustomCursor;
