import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Settings, Eye, Trash2, Edit3, Check, X, 
  MessageCircle, Instagram, Facebook, Calendar, 
  User, Users, Users2, Sun, Moon, Waves, Heart, 
  Share2, ArrowLeft, Clock, ShieldCheck, Star,
  Lock, LogIn, ExternalLink, ChevronRight, Minus,
  Baby, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import logo from "../assets/logo.png";
import OptimizedImage from "../components/common/OptimizedImage";
import "./PromotionEngine.css";

const DATA_VERSION = "3.2"; // Resetting for path stability

// Helper to resolve images robustly across dev/prod
const resolveOfferImage = (imgName) => {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  // Avoid double slashes and ensure proper pathing
  return `${cleanBase}offers/${imgName}`.replace(/\/+/g, '/').replace(':/', '://');
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const INITIAL_OFFERS = [
  {
    id: "off-marriott-2026",
    hotel: "marriott",
    hotelName: "Hurghada Marriott Red Sea Resort",
    type: "Hard All-Inclusive",
    title: "Summer 2026 Exclusive",
    period: "2026-04-25 to 2026-05-26",
    image: resolveOfferImage("Hurghada_Marriott_Red_Sea_Resort.png"),
    prices: { s: 8200, d: 8800, t: 11800 },
    kids: "1st Child (up to 11.99): FREE | 2nd (1.99-11.99): 2800 LE / night",
    addons: [
      { id: "sea-view", name: "Sea View Upgrade", price: 300, type: "per_night" },
      { id: "extra-kid", name: "2nd Child Supplement", price: 2800, type: "per_night" }
    ],
    active: true,
    badge: "LUXURY CHOICE",
    validTo: "2026-05-26"
  },
  {
    id: "off-skyview-2026",
    hotel: "skyview",
    hotelName: "Sky View Hurghada",
    type: "Full Board",
    title: "Sky High Serenity",
    period: "2026-04-25 to 2026-05-26",
    image: resolveOfferImage("Sky_View_Hurghada.png"),
    prices: { s: 4200, d: 4800 },
    kids: "1st Child (up to 11.99): FREE | 2nd (1.99-11.99): 1200 LE / night",
    addons: [
      { id: "extra-kid", name: "2nd Child Supplement", price: 1200, type: "per_night" }
    ],
    active: true,
    badge: "BEST VALUE",
    validTo: "2026-05-26"
  },
  {
    id: "off-lemonsoul-2026",
    hotel: "lemonsoul",
    hotelName: "Lemon & Soul Makadi Garden",
    type: "Hard All-Inclusive",
    title: "Vibrant Summer Escape",
    period: "2026-04-20 to 2026-06-30",
    image: resolveOfferImage("LemonSoul_Makadi_Garden.png"),
    periods: [
        { dates: "20/04 - 26/05", s: 4000, d: 5200 },
        { dates: "27/05 - 01/06", s: 4200, d: 5500 },
        { dates: "01/06 - 30/06", s: 4050, d: 5300 }
    ],
    kids: "1st Child (up to 11.99): FREE | Max 2+1 or 1+2",
    addons: [
      { id: "transfer", name: "Airport Transfer", price: 600, type: "fixed" }
    ],
    active: true,
    badge: "VIBRANT STAY",
    validTo: "2026-06-30",
    constraints: { maxPax: 3, maxAdults: 2, maxChildren: 2 }
  }
];

const HOTELS = [
  { id: "marriott", name: "Hurghada Marriott Red Sea Resort", img: "Hurghada_Marriott_Red_Sea_Resort.png" },
  { id: "skyview", name: "Sky View Hurghada", img: "Sky_View_Hurghada.png" },
  { id: "lemonsoul", name: "Lemon & Soul Makadi Garden", img: "LemonSoul_Makadi_Garden.png" }
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString() || "0";
const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const getDaysBetween = (start, end) => {
    if (!start || !end) return 1;
    // Normalize dates to local midnight to avoid DST/timezone issues
    const s = new Date(start);
    const e = new Date(end);
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);
    
    const diff = e.getTime() - s.getTime();
    const nights = Math.round(diff / 86400000);
    return Math.max(1, nights); 
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const InquiryPanel = ({ offer, partnerName, setPartnerName, onSend, onClose }) => {
    const { t, language } = useLanguage();
    const getFirstAvailableType = () => {
        const priceSet = offer.prices || (offer.periods && offer.periods[0]);
        if (!priceSet) return 'd';
        if (priceSet.s > 0) return 's';
        if (priceSet.d > 0) return 'd';
        if (priceSet.t > 0) return 't';
        return 'd';
    };

    const [roomRows, setRoomRows] = useState(() => {
        const today = new Date().toISOString().split('T')[0];
        const [periodStart, periodEnd] = offer.period.split(" to ");
        
        // Logic: If today is after periodStart but before periodEnd, start from today.
        // If today is before periodStart, start from periodStart.
        const checkIn = today > periodStart ? (today < periodEnd ? today : periodStart) : periodStart;
        
        // Default checkout to 1 night later, but cap at periodEnd
        const nextDay = new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0];
        const checkOut = nextDay <= periodEnd ? nextDay : periodEnd;

        return [
            { 
                id: Date.now(), 
                type: getFirstAvailableType(), 
                adults: 2, 
                children: 0,
                checkIn,
                checkOut,
                addons: []
            }
        ];
    });

    const getPriceSetForDate = (checkIn) => {
        if (offer.prices) return offer.prices;
        if (!offer.periods) return null;
        
        const date = new Date(checkIn);
        return offer.periods.find(p => {
            const [startStr, endStr] = p.dates.split(" - ");
            const [sD, sM] = startStr.split("/").map(Number);
            const [eD, eM] = endStr.split("/").map(Number);
            // Assume 2026 context
            const start = new Date(2026, sM - 1, sD);
            const end = new Date(2026, eM - 1, eD);
            return date >= start && date <= end;
        }) || offer.periods[0];
    };

    const calculateTotal = () => {
        let grandTotal = 0;
        
        roomRows.forEach(room => {
            const nights = getDaysBetween(room.checkIn, room.checkOut);
            const priceSet = getPriceSetForDate(room.checkIn);
            let roomTotal = 0;
            
            if (!priceSet) return;

            // Base room price (Per Night calculation)
            const roomPricePerNight = (priceSet[room.type] || 0);
            roomTotal += roomPricePerNight * nights;
            
            // Children Supplement logic: 1st is FREE, others are charged per night
            if (room.children > 1) {
                const secondChildAddon = offer.addons?.find(a => a.id === "extra-kid");
                if (secondChildAddon) {
                    // (Number of children - 1 free child) * price * nights
                    roomTotal += (room.children - 1) * secondChildAddon.price * nights;
                }
            }
            
            // Other Add-ons (Upgrade, etc.)
            offer.addons?.forEach(addon => {
                if (room.addons.includes(addon.id) && addon.id !== "extra-kid") {
                    if (addon.type === "per_night") {
                        roomTotal += addon.price * nights;
                    } else if (addon.type === "per_stay") {
                        roomTotal += addon.price;
                    } else {
                        // Default to fixed if not specified
                        roomTotal += addon.price;
                    }
                }
            });
            
            grandTotal += roomTotal;
        });
        
        return grandTotal;
    };

    const addRoomRow = () => {
        const lastRoom = roomRows[roomRows.length - 1];
        setRoomRows([...roomRows, { 
            id: Date.now(), 
            type: getFirstAvailableType(), 
            adults: 2, 
            children: 0,
            checkIn: lastRoom?.checkIn || offer.period.split(" to ")[0],
            checkOut: lastRoom?.checkOut || offer.period.split(" to ")[1],
            addons: []
        }]);
    };

    const updateRoomRow = (id, field, value) => {
        setRoomRows(prev => prev.map(row => {
            if (row.id !== id) return row;
            const updated = { ...row, [field]: value };
            
            // If checkIn changed, ensure checkOut is at least 1 day after
            if (field === 'checkIn') {
                if (updated.checkOut <= value) {
                    updated.checkOut = new Date(new Date(value).getTime() + 86400000).toISOString().split('T')[0];
                }
            }
            return updated;
        }));
    };

    const toggleRoomAddon = (roomId, addonId) => {
        setRoomRows(roomRows.map(r => {
            if (r.id !== roomId) return r;
            const newAddons = r.addons.includes(addonId) 
                ? r.addons.filter(id => id !== addonId)
                : [...r.addons, addonId];
            return { ...r, addons: newAddons };
        }));
    };

    const removeRoomRow = (id) => {
        if (roomRows.length > 1) {
            setRoomRows(roomRows.filter(r => r.id !== id));
        }
    };

    return (
        <motion.div 
            className="inquiry-glass-panel"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="panel-inner">
                <div className="panel-section-title">
                    <div className="title-left">
                        <Users2 size={16} className="gold" />
                        <span>{t('promo_engine.configure')}</span>
                    </div>
                    <button onClick={onClose} className="panel-close"><X size={16}/></button>
                </div>

                <div className="panel-grid">
                    {/* Partner ID - Now inside the inquiry */}
                    <div className="panel-field full">
                        <label className="field-label">{t('promo_engine.partner_id')}</label>
                        <div className="premium-input-box">
                            <User size={14} className="gold" />
                            <input 
                                type="text" 
                                placeholder={t('promo_engine.partner_placeholder')}
                                value={partnerName}
                                onChange={e => setPartnerName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="panel-field full">
                        <div className="section-header-row">
                            <label className="field-label">{t('promo_engine.room_configs')}</label>
                            <button className="add-room-mini" onClick={addRoomRow}>
                                <Plus size={14} />
                                <span>{t('promo_engine.add_room')}</span>
                            </button>
                        </div>
                        <div className="room-rows-container">
                            {roomRows.map((room, index) => (
                                <div key={room.id} className="room-config-row-v2">
                                    <div className="row-main-meta">
                                        <div className="row-num">#{index + 1}</div>
                                        <select 
                                            value={room.type} 
                                            onChange={e => updateRoomRow(room.id, 'type', e.target.value)}
                                            className="row-select-v2"
                                        >
                                            {/* Show only available room types based on prices */}
                                            {(() => {
                                                const priceSet = getPriceSetForDate(room.checkIn);
                                                if (!priceSet) return <option value="d">Double</option>;
                                                
                                                return [
                                                    { key: 's', label: t('promo_engine.room_s') },
                                                    { key: 'd', label: t('promo_engine.room_d') },
                                                    { key: 't', label: t('promo_engine.room_t') }
                                                ].filter(item => priceSet[item.key] > 0)
                                                 .map(item => <option key={item.key} value={item.key}>{item.label}</option>);
                                            })()}
                                        </select>
                                    </div>

                                    <div className="row-divider"></div>

                                    <div className="row-pax-group">
                                        <div className="pax-ctrl-mini">
                                            <Users size={12} />
                                            <div className="mini-counter">
                                                <button onClick={() => updateRoomRow(room.id, 'adults', Math.max(1, room.adults - 1))}><Minus size={10}/></button>
                                                <span>{room.adults}{t('booking.form.adults').charAt(0)}</span>
                                                <button onClick={() => updateRoomRow(room.id, 'adults', room.adults + 1)}><Plus size={10}/></button>
                                            </div>
                                        </div>
                                        <div className="pax-ctrl-mini">
                                            <Baby size={12} />
                                            <div className="mini-counter">
                                                <button onClick={() => updateRoomRow(room.id, 'children', Math.max(0, room.children - 1))}><Minus size={10}/></button>
                                                <span>{room.children}{t('booking.form.children').charAt(0)}</span>
                                                <button onClick={() => updateRoomRow(room.id, 'children', room.children + 1)}><Plus size={10}/></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row-divider"></div>

                                    <div className="row-dates-group">
                                        <div className="mini-date-input">
                                            <div className="date-field">
                                                <label>{t('promo_engine.check_in')}</label>
                                                <input 
                                                    type="date" 
                                                    value={room.checkIn}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    max={offer.period.split(" to ")[1]}
                                                    onChange={(e) => updateRoomRow(room.id, 'checkIn', e.target.value)}
                                                />
                                            </div>
                                            <div className="date-sep-v2">
                                                <span className="nights-count-badge">
                                                    {getDaysBetween(room.checkIn, room.checkOut)} {t('promo_engine.nights')}
                                                </span>
                                            </div>
                                            <div className="date-field">
                                                <label>{t('promo_engine.check_out')}</label>
                                                <input 
                                                    type="date" 
                                                    value={room.checkOut}
                                                    min={room.checkIn}
                                                    max={offer.period.split(" to ")[1]}
                                                    onChange={(e) => updateRoomRow(room.id, 'checkOut', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row-divider"></div>

                                    <div className="row-addons-group">
                                        <span className="row-label-mini">{t('promo_engine.enhancements')}</span>
                                        <div className="addon-pills-mini">
                                            {offer.addons?.filter(a => a.id !== "extra-kid").map(addon => (
                                                <button 
                                                    key={addon.id}
                                                    className={`addon-pill-mini ${room.addons.includes(addon.id) ? 'active' : ''}`}
                                                    onClick={() => toggleRoomAddon(room.id, addon.id)}
                                                >
                                                    {addon.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {room.children >= 2 && (
                                        <div className="supplement-badge-mini">
                                            {t('promo_engine.second_child')}
                                        </div>
                                    )}

                                    {roomRows.length > 1 && (
                                        <button className="row-del-btn-v2" onClick={() => removeRoomRow(room.id)}>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Constraint Warning for Lemon & Soul */}
                            {offer.constraints && roomRows.some(r => (r.adults + r.children) > offer.constraints.maxPax) && (
                                <div className="constraint-warning">
                                    <ShieldCheck size={14} />
                                    <span>{t('promo_engine.max_occupancy', { max: offer.constraints.maxPax })}</span>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Add-ons Section - Enhanced visibility check */}
                </div>

                <div className="panel-summary-footer">
                    <div className="summary-left">
                        <div className="sum-label">{t('promo_engine.total_rate')}</div>
                        <div className="sum-val">
                            <span className="curr">{language === 'ar' ? 'ج.م' : 'LE'}</span>
                            <span className="amt">{fmt(calculateTotal())}</span>
                        </div>
                    </div>
                    <button className="confirm-inquiry-btn" onClick={() => onSend(calculateTotal(), roomRows)}>
                        <MessageCircle size={18} />
                        <span>{t('promo_engine.check_availability')}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const OfferCard = ({ offer, onInquire, isActive, partnerName, setPartnerName, onSendWhatsApp }) => {
  const { t, language } = useLanguage();
  const left = daysLeft(offer.validTo);
  const urgent = left <= 5;

  return (
    <motion.div 
      className={`promo-card-pro ${isActive ? 'active' : ''}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="promo-card-content">
        <div className="promo-image-box">
            <img src={offer.image} alt={offer.hotelName} loading="lazy" />
        </div>

        <div className="promo-body">
            <div className="promo-header-v2">
                <div className="promo-badges-row">
                    <span className="promo-badge-v2">
                        {t(`promo_engine.badge_${offer.badge.toLowerCase().replace(/\s+/g, '_')}`, { defaultValue: offer.badge })}
                    </span>
                    <span className="promo-type-v2">
                        {t(`promo_engine.type_${offer.type.toLowerCase().replace(/\s+/g, '_')}`, { defaultValue: offer.type })}
                    </span>
                </div>
                <h3 className="promo-hotel">{offer.hotelName}</h3>
                <p className="promo-title">{offer.title}</p>
            </div>

            <div className="promo-details-grid">
                <div className="detail-item">
                    <Calendar size={14} className="gold" />
                    <span>{offer.period}</span>
                </div>
                <div className="detail-item">
                    <ShieldCheck size={14} className="gold" />
                    <span className="kids-text">{offer.kids}</span>
                </div>
            </div>

            <div className="promo-pricing-box">
                {offer.prices ? (
                    <div className="pricing-grid">
                        {['s', 'd', 't'].map(k => offer.prices[k] > 0 && (
                            <div key={k} className="p-cell">
                                <span className="p-label">{k === 's' ? t('promo_engine.room_s') : k === 'd' ? t('promo_engine.room_d') : t('promo_engine.room_t')}</span>
                                <span className="p-val">{fmt(offer.prices[k])}<small>{language === 'ar' ? 'ج.م' : 'LE'}</small></span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="seasonal-pricing">
                        {offer.periods?.map((p, i) => (
                            <div key={i} className="seasonal-row">
                                <span className="s-dates">{p.dates}</span>
                                <span className="s-prices">{t('promo_engine.room_s').charAt(0)}: {fmt(p.s)} | {t('promo_engine.room_d').charAt(0)}: {fmt(p.d)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="promo-footer-v2">
                <div className={`promo-validity-tag ${urgent ? 'urgent' : ''}`}>
                    <Clock size={12} />
                    <span>{urgent ? t('promo_engine.urgent') : `${t('promo_engine.days_left')}: ${left}`}</span>
                </div>

                {!isActive && (
                    <motion.button 
                        className="promo-cta-v2" 
                        onClick={() => onInquire(offer.id)}
                        layoutId={`cta-${offer.id}`}
                    >
                        <span>{t('promo_engine.check_availability')}</span>
                        <ChevronRight size={16} />
                    </motion.button>
                )}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminLogin = ({ onLogin }) => {
    const { t } = useLanguage();
    const [pass, setPass] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pass === "Friends2026") {
            onLogin();
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <motion.div className="admin-login-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.form 
                onSubmit={handleSubmit}
                className={`login-card ${error ? 'shake' : ''}`}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
            >
                <Lock size={32} className="login-icon" />
                <h2>{t('promo_engine.login_title')}</h2>
                <p>{t('promo_engine.login_subtitle')}</p>
                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder={t('promo_engine.login_placeholder')}
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        autoFocus
                    />
                    <button type="submit"><LogIn size={18} /></button>
                </div>
                {error && <span className="error-msg">{t('promo_engine.login_error')}</span>}
            </motion.form>
        </motion.div>
    );
};

const OfferForm = ({ offer, onSave, onCancel }) => {
  const { t, language } = useLanguage();
  const [form, setForm] = useState(offer || {
    id: `off-${Date.now()}`,
    hotel: "marriott",
    hotelName: "Hurghada Marriott Red Sea Resort",
    type: "Hard All-Inclusive",
    title: "",
    period: "2026-04-25 to 2026-05-26",
    image: "",
    prices: { s: 0, d: 0, t: 0 },
    kids: "",
    addons: [],
    active: true,
    badge: "NEW OFFER",
    validTo: ""
  });

  const addAddon = () => {
    const newAddon = { id: Date.now(), name: "New Addon", price: 0, type: "per_night" };
    setForm({...form, addons: [...(form.addons || []), newAddon]});
  };

  const updateAddon = (id, field, val) => {
    setForm({
        ...form, 
        addons: form.addons.map(a => a.id === id ? {...a, [field]: val} : a)
    });
  };

  const removeAddon = (id) => {
    setForm({...form, addons: form.addons.filter(a => a.id !== id)});
  };

  return (
    <motion.div className="admin-form-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.form 
        className="admin-form"
        onSubmit={e => { e.preventDefault(); onSave(form); }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="form-header">
          <div className="title-group">
            <Edit3 size={20} className="gold" />
            <h3>{offer ? t('promo_engine.admin_mode') : t('promo_engine.add_new')}</h3>
          </div>
          <button type="button" onClick={onCancel} className="close-btn"><X /></button>
        </div>

        <div className="form-scrollable">
            <div className="form-grid">
                <div className="form-group full">
                    <label>{language === 'en' ? 'Destination Hotel' : 'الفندق الوجهة'}</label>
                    <select 
                        value={form.hotel} 
                        onChange={e => {
                            const h = HOTELS.find(x => x.id === e.target.value);
                            setForm({...form, hotel: e.target.value, hotelName: h.name});
                        }}
                    >
                        {HOTELS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>{language === 'en' ? 'Experience Title' : 'عنوان العرض'}</label>
                    <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>

                <div className="form-group">
                    <label>{language === 'en' ? 'Operational Dates' : 'تواريخ التشغيل'}</label>
                    <input type="text" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
                </div>

                <div className="form-group pricing-inputs full">
                    <label>{language === 'en' ? 'Rates (SGL / DBL / TRP)' : 'الأسعار (فردي / مزدوج / ثلاثي)'}</label>
                    <div className="rate-fields">
                        <div className="r-field"><span className="r-tag">S</span><input type="number" value={form.prices?.s || ""} onChange={e => setForm({...form, prices: {...form.prices, s: parseInt(e.target.value)}})} /></div>
                        <div className="r-field"><span className="r-tag">D</span><input type="number" value={form.prices?.d || ""} onChange={e => setForm({...form, prices: {...form.prices, d: parseInt(e.target.value)}})} /></div>
                        <div className="r-field"><span className="r-tag">T</span><input type="number" value={form.prices?.t || ""} onChange={e => setForm({...form, prices: {...form.prices, t: parseInt(e.target.value)}})} /></div>
                    </div>
                </div>

                <div className="form-group full">
                    <div className="addons-header-form">
                        <label>{t('promo_engine.enhancements')}</label>
                        <button type="button" className="add-mini-btn" onClick={addAddon}><Plus size={14}/> {language === 'en' ? 'Add Addon' : 'إضافة ملحق'}</button>
                    </div>
                    <div className="addons-edit-list">
                        {form.addons?.map(a => (
                            <div key={a.id} className="addon-edit-row">
                                <input placeholder="Name" value={a.name} onChange={e => updateAddon(a.id, 'name', e.target.value)} />
                                <input type="number" placeholder="Price" value={a.price} onChange={e => updateAddon(a.id, 'price', parseInt(e.target.value))} />
                                <select value={a.type} onChange={e => updateAddon(a.id, 'type', e.target.value)}>
                                    <option value="per_night">{language === 'en' ? 'Per Night' : 'لكل ليلة'}</option>
                                    <option value="per_room">{language === 'en' ? 'Per Room' : 'لكل غرفة'}</option>
                                    <option value="per_stay">{language === 'en' ? 'Per Stay' : 'لكل إقامة'}</option>
                                    <option value="fixed">{language === 'en' ? 'Fixed' : 'ثابت'}</option>
                                </select>
                                <button type="button" className="del-mini-btn" onClick={() => removeAddon(a.id)}><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>{language === 'en' ? 'Policy Highlight' : 'سياسة الأطفال'}</label>
                    <input type="text" value={form.kids} onChange={e => setForm({...form, kids: e.target.value})} />
                </div>

                <div className="form-group">
                    <label>{t('promo_engine.valid_until')}</label>
                    <input type="date" value={form.validTo} onChange={e => setForm({...form, validTo: e.target.value})} />
                </div>
            </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">{t('promo_engine.discard')}</button>
          <button type="submit" className="save-btn">{t('promo_engine.save')}</button>
        </div>
      </motion.form>
    </motion.div>
  );
};

// ─── MAIN ENGINE ──────────────────────────────────────────────────────────────

export default function PromotionEngine() {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem("fg_promos");
    const savedVer = localStorage.getItem("fg_promos_ver");
    if (saved && savedVer === DATA_VERSION) return JSON.parse(saved);
    return INITIAL_OFFERS;
  });

  useEffect(() => {
    localStorage.setItem("fg_promos", JSON.stringify(offers));
    localStorage.setItem("fg_promos_ver", DATA_VERSION);
  }, [offers]);

  const [view, setView] = useState("public"); // public | admin | login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeInquiryId, setActiveInquiryId] = useState(null);
  const [partnerName, setPartnerName] = useState(localStorage.getItem("fg_partner") || "");

  useEffect(() => {
    localStorage.setItem("fg_promos", JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem("fg_partner", partnerName);
  }, [partnerName]);

  const saveOffer = (offer) => {
    if (isAdding) setOffers([...offers, offer]);
    else setOffers(offers.map(o => o.id === offer.id ? offer : o));
    setEditing(null); setIsAdding(false);
  };

  const deleteOffer = (id) => {
    if(window.confirm("Confirm deletion of this record?")) {
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  const resetToDefaults = () => {
      if(window.confirm("Reset all offers to defaults? This will erase custom changes.")) {
          setOffers(INITIAL_OFFERS);
      }
  };

  const handleAdminToggle = () => {
    if (view === "admin") setView("public");
    else if (isLoggedIn) setView("admin");
    else setView("login");
  };

  const handleSendWhatsApp = (total, roomRows) => {
    const offer = offers.find(o => o.id === activeInquiryId);
    
    const roomLines = roomRows.map((r, i) => {
        const typeStr = r.type === 's' ? 'Single' : r.type === 'd' ? 'Double' : 'Triple';
        const addonsStr = offer.addons
            ?.filter(a => r.addons.includes(a.id))
            .map(a => a.name)
            .join(", ");
        
        return `Room ${i+1}: ${typeStr}
- Pax: ${r.adults} Adults, ${r.children} Children
- Dates: ${r.checkIn} to ${r.checkOut}
- Enhancements: ${addonsStr || "Standard"}`;
    });

    const msg = `*B2B COMPLEX INQUIRY - FRIENDS GROUP*
-------------------------
*Partner:* ${partnerName || 'Verified Partner'}
*Hotel:* ${offer.hotelName}
*Offer:* ${offer.title}
-------------------------
*Requested Breakdown:*
${roomLines.join("\n\n")}
-------------------------
*Estimated Total:* ${fmt(total)} LE
*Status:* High-Priority Availability Check...`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/201207776033?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className={`promo-engine-container ${theme}-mode`}>
      {/* Premium Header */}
      <nav className="engine-top-bar">
        <div className="container bar-inner">
            <div className="nav-actions left">
                <motion.button
                    className="lang-toggle"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLanguage}
                >
                    {language === "en" ? "العربية" : "English"}
                </motion.button>

                <Link to="/" className="lang-toggle">
                    {language === 'en' ? 'Home' : 'الرئيسية'}
                </Link>
            </div>

            <div className="engine-logo-box">
                <img src={logo} alt="Friends Group" className="engine-logo" />
            </div>

            <div className="nav-actions right">
                <motion.button
                    className="theme-toggle"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>

                <motion.button 
                    className={`admin-access-btn ${view === "admin" ? "active" : ""}`} 
                    onClick={handleAdminToggle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {view === "admin" ? <Eye size={18} /> : <Settings size={18} />}
                    <span className="nav-text">{view === "admin" ? t('promo_engine.exit_admin') : t('promo_engine.operator')}</span>
                </motion.button>
            </div>
        </div>
      </nav>

      <main className="engine-body">
        {view === "public" && (
          <div className="public-content">
            <section className="promo-hero-pro">
              <div className="hero-bg-overlay">
                  <OptimizedImage src={resolveOfferImage("hero-bg.png")} alt="" className="hero-img" />
                  <div className="hero-gradient"></div>
              </div>
              <div className="container hero-inner">
                <motion.div 
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="hero-text-box"
                >
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="hero-tag"
                    >
                        {t('promo_engine.title')}
                    </motion.span>
                    <h1 className="cinematic-title">{t('promo_engine.hero_title')}</h1>
                    <p className="hero-subtitle">{t('promo_engine.hero_subtitle')}</p>
                    
                    <motion.div 
                        className="hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                         <div className="hero-stats">
                            <div className="stat">
                                <Users size={16} />
                                <span>{t('promo_engine.partners_count')}</span>
                            </div>
                            <div className="stat">
                                <Star size={16} />
                                <span>{t('promo_engine.premium_inventory')}</span>
                            </div>
                         </div>
                    </motion.div>
                </motion.div>
              </div>
            </section>

            <div className="container">
                <div className="promo-grid-pro">
                    {offers.filter(o => o.active).map(offer => (
                        <React.Fragment key={offer.id}>
                            <OfferCard 
                                key={offer.id} 
                                offer={offer} 
                                isActive={activeInquiryId === offer.id}
                                onInquire={setActiveInquiryId} 
                            />
                            <AnimatePresence>
                                {activeInquiryId === offer.id && (
                                    <InquiryPanel 
                                        offer={offer} 
                                        partnerName={partnerName}
                                        setPartnerName={setPartnerName}
                                        onClose={() => setActiveInquiryId(null)}
                                        onSend={handleSendWhatsApp}
                                    />
                                )}
                            </AnimatePresence>
                        </React.Fragment>
                    ))}
                </div>
            </div>
          </div>
        )}

        {view === "login" && <AdminLogin onLogin={() => { setIsLoggedIn(true); setView("admin"); }} />}

        {view === "admin" && (
          <div className="container admin-content">
            <header className="admin-header-row">
              <div className="admin-title-group">
                  <h2>{t('promo_engine.admin_mode')}</h2>
                  <p>{t('promo_engine.admin_subtitle')}</p>
              </div>
              <div className="admin-master-actions">
                  <button className="reset-btn" onClick={resetToDefaults}>{t('promo_engine.reset')}</button>
                  <button className="add-offer-btn-pro" onClick={() => setIsAdding(true)}>
                    <Plus size={18} />
                    <span>{t('promo_engine.add_new')}</span>
                  </button>
              </div>
            </header>

            <div className="admin-data-grid">
              {offers.map(offer => (
                <motion.div key={offer.id} className="admin-row-item" layout>
                  <div className="row-main">
                    <img src={offer.image} alt="" className="row-thumb" />
                    <div className="row-details">
                      <div className="row-hotel">{offer.hotelName}</div>
                      <div className="row-sub">{offer.title} • {offer.period}</div>
                    </div>
                  </div>
                  <div className="row-stats-quick">
                      <div className="q-stat"><span className="q-label">S</span> {fmt(offer.prices?.s)}</div>
                      <div className="q-stat"><span className="q-label">D</span> {fmt(offer.prices?.d)}</div>
                      <div className="q-stat"><span className="q-label">T</span> {fmt(offer.prices?.t)}</div>
                  </div>
                  <div className="row-actions">
                    <button onClick={() => setEditing(offer)} className="row-btn edit" title="Edit"><Edit3 size={16} /></button>
                    <button onClick={() => deleteOffer(offer.id)} className="row-btn delete" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="engine-pro-footer">
        <div className="container footer-inner">
            <div className="footer-meta-inline">
                <p>&copy; 2026 Friends Group Management System v3.0 &amp; {t('promo_engine.session_active')}</p>
                <div className="status-dot green"></div>
            </div>
            <img src={logo} alt="" className="footer-logo-dim" />
        </div>
      </footer>

      <AnimatePresence>
        {(isAdding || editing) && (
          <OfferForm 
            offer={editing} 
            onSave={saveOffer} 
            onCancel={() => {setEditing(null); setIsAdding(false);}} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
