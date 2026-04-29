import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import './NotFound.css';

const NotFound = () => {
    const { t, isRTL } = useLanguage();

    return (
        <div className="not-found-wrapper">
            <div className="not-found-content">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    404
                </motion.h1>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {isRTL 
                        ? 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.' 
                        : "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link to="/" className="btn-primary">
                        {isRTL ? 'العودة للرئيسية' : 'Return Home'}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
