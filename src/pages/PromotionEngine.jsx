import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Settings, Eye, Trash2, Edit3, Check, X, 
  MessageCircle, Instagram, Facebook, Calendar, 
  User, Users, Users2, Sun, Waves, Heart, 
  Share2, ArrowLeft, Clock, ShieldCheck, Star,
  Lock, LogIn, ExternalLink, ChevronRight, Minus,
  Baby, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./PromotionEngine.css";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const INITIAL_OFFERS = [
  {
    id: "off-marriott-2026",
    hotel: "marriott",
    hotelName: "Hurghada Marriott Red Sea Resort",
    type: "Hard All-Inclusive",
    title: "Summer 2026 Exclusive",
    period: "2026-04-25 to 2026-05-26",
    image: "/FriendsGroup/offers/Hurghada_Marriott_Red_Sea_Resort.png",
    prices: { s: 8200, d: 8800, t: 11800 },
    kids: "1st Child (up to 11.99): FREE | 2nd (1.99-11.99): 2800 LE",
    addons: [
      { id: "sea-view", name: "Sea View Upgrade", price: 300, type: "per_night" },
      { id: "extra-kid", name: "2nd Child Supplement", price: 2800, type: "per_stay" }
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
    image: "/FriendsGroup/offers/Sky_View_Hurghada.png",
    prices: { s: 4200, d: 4800 },
    kids: "1st Child (up to 11.99): FREE",
    addons: [
      { id: "late-checkout", name: "Late Check-out (4PM)", price: 500, type: "per_room" }
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
    image: "/FriendsGroup/offers/Lemon&Soul_Makadi_Garden.png",
    periods: [
        { dates: "20/04 - 26/05", s: 4000, d: 5200 },
        { dates: "27/05 - 01/06", s: 4200, d: 5500 },
        { dates: "01/06 - 30/06", s: 4050, d: 5300 }
    ],
    kids: "1st Child (up to 11.99): FREE",
    addons: [
      { id: "transfer", name: "Airport Transfer", price: 600, type: "fixed" }
    ],
    active: true,
    badge: "VIBRANT STAY",
    validTo: "2026-06-30"
  }
];

const HOTELS = [
  { id: "marriott", name: "Hurghada Marriott Red Sea Resort" },
  { id: "skyview", name: "Sky View Hurghada" },
  { id: "lemonsoul", name: "Lemon & Soul Makadi Garden" }
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString() || "0";
const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const getDaysBetween = (start, end) => {
    if (!start || !end) return 1;
    const diff = new Date(end) - new Date(start);
    return Math.max(1, Math.ceil(diff / 86400000));
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const InquiryPanel = ({ offer, partnerName, setPartnerName, onSend, onClose }) => {
    const getFirstAvailableType = () => {
        const priceSet = offer.prices || (offer.periods && offer.periods[0]);
        if (!priceSet) return 'd';
        if (priceSet.s > 0) return 's';
        if (priceSet.d > 0) return 'd';
        if (priceSet.t > 0) return 't';
        return 'd';
    };

    const [roomRows, setRoomRows] = useState([
        { 
            id: Date.now(), 
            type: getFirstAvailableType(), 
            adults: 2, 
            children: 0,
            checkIn: offer.period.split(" to ")[0] || new Date().toISOString().split('T')[0],
            checkOut: offer.period.split(" to ")[1] || new Date().toISOString().split('T')[0],
            addons: []
        }
    ]);

    const calculateTotal = () => {
        let grandTotal = 0;
        const priceSet = offer.prices || offer.periods[0];
        
        roomRows.forEach(room => {
            const nights = getDaysBetween(room.checkIn, room.checkOut);
            let roomTotal = 0;
            
            // Base room price
            roomTotal += (priceSet[room.type] || 0);
            
            // 2nd Child Supplement
            if (room.children >= 2) {
                const secondChildPrice = offer.addons?.find(a => a.id === "extra-kid")?.price || 2800;
                roomTotal += secondChildPrice;
            }
            
            // Per-Room Add-ons
            offer.addons?.forEach(addon => {
                if (room.addons.includes(addon.id) && addon.id !== "extra-kid") {
                    if (addon.type === "per_night") {
                        roomTotal += addon.price * nights;
                    } else {
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

    const updateRoomRow = (id, field, val) => {
        setRoomRows(roomRows.map(r => r.id === id ? {...r, [field]: val} : r));
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
                        <span>Configure Your Inquiry</span>
                    </div>
                    <button onClick={onClose} className="panel-close"><X size={16}/></button>
                </div>

                <div className="panel-grid">
                    {/* Partner ID - Now inside the inquiry */}
                    <div className="panel-field full">
                        <label className="field-label">Partner Identification</label>
                        <div className="premium-input-box">
                            <User size={14} className="gold" />
                            <input 
                                type="text" 
                                placeholder="Travel Agency / Partner Name" 
                                value={partnerName}
                                onChange={e => setPartnerName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="panel-field full">
                        <div className="section-header-row">
                            <label className="field-label">Room Configurations</label>
                            <button className="add-room-mini" onClick={addRoomRow}>
                                <Plus size={14} />
                                <span>Add Another Room</span>
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
                                                const priceSet = offer.prices || (offer.periods && offer.periods[0]);
                                                if (!priceSet) return <option value="d">Double</option>;
                                                
                                                return [
                                                    { key: 's', label: 'Single' },
                                                    { key: 'd', label: 'Double' },
                                                    { key: 't', label: 'Triple' }
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
                                                <span>{room.adults}A</span>
                                                <button onClick={() => updateRoomRow(room.id, 'adults', room.adults + 1)}><Plus size={10}/></button>
                                            </div>
                                        </div>
                                        <div className="pax-ctrl-mini">
                                            <Baby size={12} />
                                            <div className="mini-counter">
                                                <button onClick={() => updateRoomRow(room.id, 'children', Math.max(0, room.children - 1))}><Minus size={10}/></button>
                                                <span>{room.children}C</span>
                                                <button onClick={() => updateRoomRow(room.id, 'children', room.children + 1)}><Plus size={10}/></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row-divider"></div>

                                    <div className="row-dates-group">
                                        <div className="mini-date-input">
                                            <Calendar size={12} />
                                            <input type="date" value={room.checkIn} onChange={e => updateRoomRow(room.id, 'checkIn', e.target.value)} />
                                            <ArrowRight size={10} />
                                            <input type="date" value={room.checkOut} onChange={e => updateRoomRow(room.id, 'checkOut', e.target.value)} />
                                            <span className="nights-badge">{getDaysBetween(room.checkIn, room.checkOut)}N</span>
                                        </div>
                                    </div>

                                    <div className="row-divider"></div>

                                    <div className="row-addons-group">
                                        <span className="row-label-mini">Enhancements</span>
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
                                            2nd Child Suppl.
                                        </div>
                                    )}

                                    {roomRows.length > 1 && (
                                        <button className="row-del-btn-v2" onClick={() => removeRoomRow(room.id)}>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Add-ons Section - Enhanced visibility check */}
                </div>

                <div className="panel-summary-footer">
                    <div className="summary-left">
                        <div className="sum-label">ESTIMATED TOTAL RATE</div>
                        <div className="sum-val">
                            <span className="curr">LE</span>
                            <span className="amt">{fmt(calculateTotal())}</span>
                        </div>
                    </div>
                    <button className="confirm-inquiry-btn" onClick={() => onSend(calculateTotal(), roomRows)}>
                        <MessageCircle size={18} />
                        <span>Check availability & get confirmation</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const OfferCard = ({ offer, isActive, onInquire, partnerName, setPartnerName, onSendWhatsApp }) => {
  const left = daysLeft(offer.validTo);
  const urgent = left <= 15;

  return (
    <motion.div 
      className={`promo-card-pro ${isActive ? 'active' : ''}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="promo-card-content">
        <div className="promo-image-box">
            <img src={offer.image} alt={offer.hotelName} loading="lazy" />
            <div className="promo-badge">{offer.badge}</div>
            <div className="promo-overlay"></div>
            {left > 0 && (
            <div className={`promo-timer ${urgent ? 'urgent' : ''}`}>
                <Clock size={12} />
                <span>{left} days remaining</span>
            </div>
            )}
        </div>

        <div className="promo-body">
            <div className="promo-header">
            <span className="promo-type">{offer.type}</span>
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
                                <span className="p-label">{k === 's' ? 'Single' : k === 'd' ? 'Double' : 'Triple'}</span>
                                <span className="p-val">{fmt(offer.prices[k])}<small>LE</small></span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="seasonal-pricing">
                        {offer.periods?.map((p, i) => (
                            <div key={i} className="seasonal-row">
                                <span className="s-dates">{p.dates}</span>
                                <span className="s-prices">S: {fmt(p.s)} | D: {fmt(p.d)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!isActive && (
                <motion.button 
                    className="promo-cta" 
                    onClick={() => onInquire(offer.id)}
                    layoutId={`cta-${offer.id}`}
                >
                    <MessageCircle size={18} />
                    <span>Configure Inquiry</span>
                </motion.button>
            )}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
            <InquiryPanel 
                offer={offer} 
                partnerName={partnerName}
                setPartnerName={setPartnerName}
                onClose={() => onInquire(null)}
                onSend={onSendWhatsApp}
            />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdminLogin = ({ onLogin }) => {
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
                <Lock size={42} className="login-icon" />
                <h2>Operator Panel</h2>
                <p>Secure authentication required for promotion management.</p>
                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder="Authentication Token" 
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        autoFocus
                    />
                    <button type="submit">Access</button>
                </div>
                {error && <span className="error-msg">Invalid Credentials</span>}
            </motion.form>
        </motion.div>
    );
};

const OfferForm = ({ offer, onSave, onCancel }) => {
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
            <Settings size={22} className="gold" />
            <div className="h-meta">
                <h3>{offer ? 'Refine Promotion' : 'Craft New Experience'}</h3>
                <span>Configure hotel details, rates, and seasonal supplements</span>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="close-btn"><X /></button>
        </div>

        <div className="form-scrollable">
            <div className="form-grid">
                <div className="form-group full">
                    <label><Star size={14} className="gold" /> Destination Hotel</label>
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
                    <label><Sun size={14} className="gold" /> Experience Title</label>
                    <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Summer 2026 Exclusive" />
                </div>

                <div className="form-group">
                    <label><Calendar size={14} className="gold" /> Operational Dates</label>
                    <input type="text" value={form.period} onChange={e => setForm({...form, period: e.target.value})} placeholder="e.g. 2026-04-25 to 2026-05-26" />
                </div>

                <div className="form-group pricing-inputs full">
                    <label><Users2 size={14} className="gold" /> Rates (SGL / DBL / TRP)</label>
                    <div className="rate-fields">
                        <div className="r-field"><span className="r-tag">S</span><input type="number" value={form.prices?.s || ""} onChange={e => setForm({...form, prices: {...form.prices, s: parseInt(e.target.value)}})} placeholder="Single" /></div>
                        <div className="r-field"><span className="r-tag">D</span><input type="number" value={form.prices?.d || ""} onChange={e => setForm({...form, prices: {...form.prices, d: parseInt(e.target.value)}})} placeholder="Double" /></div>
                        <div className="r-field"><span className="r-tag">T</span><input type="number" value={form.prices?.t || ""} onChange={e => setForm({...form, prices: {...form.prices, t: parseInt(e.target.value)}})} placeholder="Triple" /></div>
                    </div>
                </div>

                <div className="form-group full">
                    <div className="addons-header-form">
                        <label>Special Add-ons</label>
                        <button type="button" className="add-mini-btn" onClick={addAddon}><Plus size={14}/> Add Addon</button>
                    </div>
                    <div className="addons-edit-list">
                        {form.addons?.map(a => (
                            <div key={a.id} className="addon-edit-row">
                                <input placeholder="Name" value={a.name} onChange={e => updateAddon(a.id, 'name', e.target.value)} />
                                <input type="number" placeholder="Price" value={a.price} onChange={e => updateAddon(a.id, 'price', parseInt(e.target.value))} />
                                <select value={a.type} onChange={e => updateAddon(a.id, 'type', e.target.value)}>
                                    <option value="per_night">Per Night</option>
                                    <option value="per_room">Per Room</option>
                                    <option value="per_stay">Per Stay</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                                <button type="button" className="del-mini-btn" onClick={() => removeAddon(a.id)}><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label><ShieldCheck size={14} className="gold" /> Policy Highlight</label>
                    <input type="text" value={form.kids} onChange={e => setForm({...form, kids: e.target.value})} placeholder="e.g. 1st Child FREE" />
                </div>

                <div className="form-group">
                    <label><Clock size={14} className="gold" /> Validity End Date</label>
                    <input type="date" value={form.validTo} onChange={e => setForm({...form, validTo: e.target.value})} />
                </div>
            </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">Discard</button>
          <button type="submit" className="save-btn">Publish Changes</button>
        </div>
      </motion.form>
    </motion.div>
  );
};

// ─── MAIN ENGINE ──────────────────────────────────────────────────────────────

export default function PromotionEngine() {
  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem("fg_promos");
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });
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
    <div className="promo-engine-container">
      {/* Premium Header */}
      <nav className="engine-top-bar">
        <div className="container bar-inner">
            <Link to="/" className="visit-site-link">
                <ArrowLeft size={16} />
                <span className="nav-text">Visit Our Site</span>
            </Link>

            <div className="engine-logo-box">
                <img src={logo} alt="Friends Group" className="engine-logo" />
            </div>

            <div className="engine-actions">
                <button 
                    className={`admin-access-btn ${view === "admin" ? "active" : ""}`} 
                    onClick={handleAdminToggle}
                >
                    {view === "admin" ? <Eye size={18} /> : <Settings size={18} />}
                    <span className="nav-text">{view === "admin" ? "Exit Admin" : "Operator Panel"}</span>
                </button>
            </div>
        </div>
      </nav>

      <main className="engine-body">
        {view === "public" && (
          <div className="public-content">
            <section className="promo-hero-pro">
              <div className="hero-bg-overlay">
                  <img src="/FriendsGroup/offers/hero-bg.png" alt="" className="hero-img" />
                  <div className="hero-gradient"></div>
              </div>
              <div className="container hero-inner">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="hero-text-box"
                >
                    <span className="hero-tag">B2B Partner Portal</span>
                    <h1>Inquiry Orchestrator</h1>
                    <p>Configure and generate professional inquiries for your clients with real-time rate calculation and instant WhatsApp delivery.</p>
                </motion.div>
              </div>
            </section>

            <div className="container">
                <div className="promo-grid-pro">
                    {offers.filter(o => o.active).map(offer => (
                        <OfferCard 
                            key={offer.id} 
                            offer={offer} 
                            isActive={activeInquiryId === offer.id}
                            onInquire={setActiveInquiryId} 
                            partnerName={partnerName}
                            setPartnerName={setPartnerName}
                            onSendWhatsApp={handleSendWhatsApp}
                        />
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
                  <div className="badge-dim">Operational Dashboard</div>
                  <h2>Management Workspace</h2>
                  <p>Control center for all active promotions, seasonal rates, and B2B configurations.</p>
              </div>
              <div className="admin-master-actions">
                  <button className="reset-btn" onClick={resetToDefaults}>Reset Defaults</button>
                  <button className="add-offer-btn-pro" onClick={() => setIsAdding(true)}>
                    <Plus size={20} />
                    <span>Create New Promotion</span>
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
            <img src={logo} alt="" className="footer-logo-dim" />
            <div className="footer-meta">
                <p>&copy; 2026 Friends Group Management System v3.0</p>
                <div className="system-status">
                    <div className="status-dot green"></div>
                    <span>Secure B2B Session Active</span>
                </div>
            </div>
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
