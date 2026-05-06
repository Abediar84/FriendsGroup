import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import { BUSINESS_INFO } from '../config/constants';
import './Booking.css';

const Booking = () => {
    const { t, language } = useLanguage();
    const [bookingType, setBookingType] = useState('spa'); // 'spa' or 'hotel'
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        // SPA specific
        spaCategory: '',
        spaProgram: '',
        timeSlot: '',
        date: '',
        // Hotel specific
        hotel: '',
        checkIn: '',
        checkOut: '',
        roomType: '',
        adults: '2',
        children: '0',
        notes: ''
    });
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({});

    // Use keys that map to i18n paths
    const spaMenu = {
        'SPA': ['red_sea', 'paradise', 'hammam', 'vip'],
        'Massage': ['medical', 'sport', 'relax', 'hot_stone'],
        'Sauna & Steam': ['sauna_jacuzzi', 'sauna_steam', 'sauna_or_steam']
    };

    const hotels = [
        { id: 'marriott', nameKey: 'services.hotel_list.marriott.name' },
        { id: 'giftun', nameKey: 'services.hotel_list.giftun.name' },
        { id: 'skyview', nameKey: 'services.hotel_list.skyview.name' },
        { id: 'lemon', nameKey: 'services.hotel_list.lemon.name' },
        { id: 'azal', nameKey: 'services.hotel_list.azal.name', disabled: true }
    ];

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = true;
        if (!formData.phone) newErrors.phone = true;
        if (!formData.email) newErrors.email = true;
        
        if (bookingType === 'spa') {
            if (!formData.spaCategory) newErrors.spaCategory = true;
            if (!formData.spaProgram) newErrors.spaProgram = true;
            if (!formData.date) newErrors.date = true;
        } else {
            if (!formData.hotel) newErrors.hotel = true;
            if (!formData.checkIn) newErrors.checkIn = true;
            if (!formData.checkOut) newErrors.checkOut = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            // Reset program if category changes
            ...(name === 'spaCategory' ? { spaProgram: '' } : {})
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        let details = '';
        if (bookingType === 'spa') {
            const categoryLabel = formData.spaCategory === 'SPA' ? t('spa_menu.programs_title') 
                                : formData.spaCategory === 'Massage' ? t('spa_menu.massages_title') 
                                : t('spa_menu.sauna.title');
            
            details = `Service: SPA & Massage\n` +
                      `Location: Azur One Eleven\n` +
                      `Category: ${categoryLabel}\n` +
                      `Program: ${t(`booking.programs.${formData.spaProgram}`)}\n` +
                      `Date: ${formData.date}\n` +
                      `Time: ${formData.timeSlot}`;
        } else {
            details = `Service: Hotel Reservation\n` +
                      `Hotel: ${formData.hotel}\n` +
                      `Check-in: ${formData.checkIn}\n` +
                      `Check-out: ${formData.checkOut}\n` +
                      `Room: ${t(`booking.room_types.${formData.roomType.toLowerCase()}`)}\n` +
                      `Guests: ${formData.adults} Adults, ${formData.children} Children`;
        }

        const subject = `New Booking Inquiry - ${formData.name}`;
        
        // Construct a beautifully formatted HTML email
        const htmlBody = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #1a1208; padding: 20px; text-align: center; border-bottom: 3px solid #d4af37;">
                    <h2 style="color: #d4af37; margin: 0; letter-spacing: 1px;">Friends Group - New Booking</h2>
                </div>
                <div style="padding: 30px; background-color: #fcfcfc;">
                    <h3 style="color: #1a1208; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">Customer Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 120px;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formData.name}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formData.phone}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formData.email}</td></tr>
                    </table>

                    <h3 style="color: #1a1208; border-bottom: 1px solid #eee; padding-bottom: 10px;">Reservation Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        ${details.split('\n').map(line => {
                            const [key, ...rest] = line.split(':');
                            if (!key) return '';
                            return `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 120px;"><strong>${key}:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${rest.join(':').trim()}</td></tr>`;
                        }).join('')}
                    </table>

                    <h3 style="color: #1a1208; border-bottom: 1px solid #eee; padding-bottom: 10px;">Additional Notes</h3>
                    <div style="background-color: #fff; padding: 15px; border: 1px solid #eee; border-radius: 4px; font-style: italic;">
                        ${formData.notes || 'None provided.'}
                    </div>
                </div>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    This email was automatically generated from the Friends Group Booking Portal.
                </div>
            </div>
        `;

        setStatus('loading');

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, html: htmlBody }),
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            setStatus('success');
        } catch (error) {
            console.error('Error sending booking email:', error);
            // Optionally set an error state here if you have one, 
            // but falling back to success visually or an error toast is standard.
            // setStatus('error');
            alert('Failed to send email. Please try again or contact us via WhatsApp.');
            setStatus('idle');
        }
    };

    const handleWhatsApp = () => {
        if (!validate()) return;

        let details = '';
        if (bookingType === 'spa') {
            const categoryLabel = formData.spaCategory === 'SPA' ? t('spa_menu.programs_title') 
                                : formData.spaCategory === 'Massage' ? t('spa_menu.massages_title') 
                                : t('spa_menu.sauna.title');
            
            details = `*Service:* SPA & Massage%0A` +
                      `*Location:* Azur One Eleven%0A` +
                      `*Category:* ${categoryLabel}%0A` +
                      `*Program:* ${t(`booking.programs.${formData.spaProgram}`)}%0A` +
                      `*Date:* ${formData.date}%0A` +
                      `*Time:* ${formData.timeSlot}`;
        } else {
            details = `*Service:* Hotel Reservation%0A` +
                      `*Hotel:* ${formData.hotel}%0A` +
                      `*Check-in:* ${formData.checkIn}%0A` +
                      `*Check-out:* ${formData.checkOut}%0A` +
                      `*Room:* ${t(`booking.room_types.${formData.roomType.toLowerCase()}`)}%0A` +
                      `*Guests:* ${formData.adults} Adults, ${formData.children} Children`;
        }

        const message = `*New Booking Inquiry*%0A%0A` +
            `*Name:* ${formData.name}%0A` +
            `*Phone:* ${formData.phone}%0A` +
            details + `%0A` +
            `*Notes:* ${formData.notes}`;

        const whatsappUrl = `https://wa.me/${BUSINESS_INFO.contact.whatsapp_clean}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section id="booking" className="booking-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    variants={fadeIn('down', 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <span className="section-label">{t('nav.booking')}</span>
                    <h2 className="section-title">{t('booking.title')}</h2>
                    <p className="section-subtitle">{t('booking.subtitle')}</p>
                </motion.div>

                <div className="booking-grid">
                    <motion.div
                        className="booking-form-wrapper"
                        variants={fadeIn('right', 0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {/* Booking Type Toggle */}
                        <div className="booking-type-toggle">
                            <button 
                                className={`toggle-btn ${bookingType === 'spa' ? 'active' : ''}`}
                                onClick={() => setBookingType('spa')}
                            >
                                {t('booking.types.spa')}
                            </button>
                            <button 
                                className={`toggle-btn ${bookingType === 'hotel' ? 'active' : ''}`}
                                onClick={() => setBookingType('hotel')}
                            >
                                {t('booking.types.hotel')}
                            </button>
                        </div>

                        <h3 className="booking-form-title">
                            {bookingType === 'spa' ? t('booking.title_spa') : t('booking.title_hotel')}
                        </h3>

                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    className="success-message"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="success-icon">✓</div>
                                    <h3>{t('booking.status.success')}</h3>
                                    <p>{t('booking.status.success_desc')}</p>
                                    <button className="btn btn-outline" onClick={() => setStatus('idle')}>
                                        {t('booking.status.send_another')}
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="premium-form smart-form">
                                    {/* Common Personal Info */}
                                    <div className="form-row">
                                        <div className={`form-group ${errors.name ? 'error' : ''}`}>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder={t('booking.form.name')}
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder={t('booking.form.phone')}
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder={t('booking.form.email')}
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Conditional Fields */}
                                    {bookingType === 'spa' ? (
                                        <div className="conditional-fields">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <input type="text" value={t('booking.form.location_fixed')} disabled className="disabled-input" />
                                                </div>
                                                <div className={`form-group ${errors.spaCategory ? 'error' : ''}`}>
                                                    <select name="spaCategory" value={formData.spaCategory} onChange={handleChange}>
                                                        <option value="">{t('booking.form.select_category')}</option>
                                                        <option value="SPA">{t('spa_menu.programs_title')}</option>
                                                        <option value="Massage">{t('spa_menu.massages_title')}</option>
                                                        <option value="Sauna & Steam">{t('spa_menu.sauna.title')}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {formData.spaCategory && (
                                                <div className={`form-group ${errors.spaProgram ? 'error' : ''}`}>
                                                    <select name="spaProgram" value={formData.spaProgram} onChange={handleChange}>
                                                        <option value="">{t('booking.form.select_program')}</option>
                                                        {spaMenu[formData.spaCategory].map(progKey => (
                                                            <option key={progKey} value={progKey}>
                                                                {t(`booking.programs.${progKey}`)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            <div className="form-row">
                                                <div className={`form-group ${errors.date ? 'error' : ''}`}>
                                                    <label className="input-label">{t('booking.form.date')}</label>
                                                    <input type="date" name="date" value={formData.date} onChange={handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">{t('booking.form.select_time')}</label>
                                                    <select name="timeSlot" value={formData.timeSlot} onChange={handleChange}>
                                                        <option value="">{t('booking.form.select_service')}</option>
                                                        {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'].map(slot => {
                                                            const localizedSlot = language === 'ar' 
                                                                ? slot.replace('AM', 'صباحاً').replace('PM', 'مساءً')
                                                                : slot;
                                                            return (
                                                                <option key={slot} value={slot}>{localizedSlot}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="conditional-fields">
                                            <div className={`form-group ${errors.hotel ? 'error' : ''}`}>
                                                <select name="hotel" value={formData.hotel} onChange={handleChange}>
                                                    <option value="">{t('booking.form.select_hotel')}</option>
                                                    {hotels.map(h => (
                                                        <option key={h.id} value={t(h.nameKey)} disabled={h.disabled}>
                                                            {t(h.nameKey)} {h.disabled ? `(${language === 'en' ? 'Sold Out' : 'تم البيع'})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-row">
                                                <div className={`form-group ${errors.checkIn ? 'error' : ''}`}>
                                                    <label className="input-label">{t('booking.form.check_in')}</label>
                                                    <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />
                                                </div>
                                                <div className={`form-group ${errors.checkOut ? 'error' : ''}`}>
                                                    <label className="input-label">{t('booking.form.check_out')}</label>
                                                    <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <select name="roomType" value={formData.roomType} onChange={handleChange}>
                                                        <option value="">{t('booking.form.room_type')}</option>
                                                        <option value="Single">{t('booking.room_types.single')}</option>
                                                        <option value="Double">{t('booking.room_types.double')}</option>
                                                        <option value="Triple">{t('booking.room_types.triple')}</option>
                                                        <option value="Suite">{t('booking.room_types.suite')}</option>
                                                    </select>
                                                </div>
                                                <div className="form-group guest-inputs">
                                                    <div className="guest-col">
                                                        <label>{t('booking.form.adults')}</label>
                                                        <input type="number" name="adults" min="1" max="10" value={formData.adults} onChange={handleChange} />
                                                    </div>
                                                    <div className="guest-col">
                                                        <label>{t('booking.form.children')}</label>
                                                        <input type="number" name="children" min="0" max="10" value={formData.children} onChange={handleChange} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <textarea
                                            name="notes"
                                            placeholder={t('booking.form.message')}
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows="3"
                                        ></textarea>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                                            {status === 'loading' ? t('booking.form.processing') : t('booking.form.submit')}
                                        </button>
                                        <button type="button" className="btn btn-whatsapp" onClick={handleWhatsApp}>
                                            <span className="wa-icon">📲</span> {t('booking.form.whatsapp')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="booking-info"
                        variants={fadeIn('left', 0.6)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <div className="info-card">
                            <h4>{t('booking.benefits.title')}</h4>
                            <ul className="benefits-list">
                                {t('booking.benefits.list').map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Booking;
