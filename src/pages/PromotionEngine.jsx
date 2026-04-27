import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Settings, Eye, Trash2, Edit3, Check, X, 
  MessageCircle, Instagram, Facebook, Calendar, 
  User, Users, Users2, Sun, Waves, Heart, 
  Share2, ArrowLeft, Clock, ShieldCheck, Star,
  Lock, LogIn, ExternalLink, ChevronRight
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
    period: "25/04 - 26/05/2026",
    image: "/FriendsGroup/offers/marriott.png",
    prices: { s: 8200, d: 8800, t: 11800 },
    kids: "1st Child (up to 11.99): FREE | 2nd (1.99-11.99): 2800 LE",
    extras: "Sea View Upgrade: +300 LE",
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
    period: "25/04 - 26/05/2026",
    image: "/FriendsGroup/offers/skyview.png",
    prices: { s: 4200, d: 4800 },
    kids: "1st Child (up to 11.99): FREE | Extra: 1200 LE / Night",
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
    period: "20/04 - 30/06/2026",
    image: "/FriendsGroup/offers/lemonsoul.png",
    periods: [
        { dates: "20/04 - 26/05", s: 4000, d: 5200 },
        { dates: "27/05 - 01/06", s: 4200, d: 5500 },
        { dates: "01/06 - 30/06", s: 4050, d: 5300 }
    ],
    kids: "1st Child (up to 11.99): FREE | Max Capacity: 2+1 or 1+2",
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

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const OfferCard = ({ offer }) => {
  const left = daysLeft(offer.validTo);
  const urgent = left <= 15;

  const handleBook = () => {
    const msg = `Interested in the Summer 2026 Offer for ${offer.hotelName}\nPeriod: ${offer.period}`;
    window.open(`https://wa.me/201207776033?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <motion.div 
      className="promo-card"
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
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
                <span>{offer.kids}</span>
            </div>
        </div>

        <div className="promo-pricing-box">
          {offer.prices ? (
            <div className="pricing-grid">
                {offer.prices.s && (
                    <div className="p-cell">
                        <span className="p-label">Single</span>
                        <span className="p-val">{fmt(offer.prices.s)}<small>LE</small></span>
                    </div>
                )}
                {offer.prices.d && (
                    <div className="p-cell">
                        <span className="p-label">Double</span>
                        <span className="p-val">{fmt(offer.prices.d)}<small>LE</small></span>
                    </div>
                )}
                {offer.prices.t && (
                    <div className="p-cell">
                        <span className="p-label">Triple</span>
                        <span className="p-val">{fmt(offer.prices.t)}<small>LE</small></span>
                    </div>
                )}
            </div>
          ) : (
            <div className="seasonal-pricing">
                {offer.periods.map((p, i) => (
                    <div key={i} className="seasonal-row">
                        <span className="s-dates">{p.dates}</span>
                        <span className="s-prices">S: {fmt(p.s)} | D: {fmt(p.d)}</span>
                    </div>
                ))}
            </div>
          )}
        </div>

        {offer.extras && (
            <div className="promo-extras">
                <Star size={12} />
                <span>{offer.extras}</span>
            </div>
        )}

        <button className="promo-cta" onClick={handleBook}>
          <MessageCircle size={18} />
          <span>Book Exclusive Rate</span>
        </button>
      </div>
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
                <Lock size={32} className="login-icon" />
                <h2>Operator Access</h2>
                <p>Secure authentication required to manage promotions.</p>
                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        autoFocus
                    />
                    <button type="submit"><LogIn size={18} /></button>
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
    period: "",
    image: "",
    prices: { s: 0, d: 0, t: 0 },
    kids: "",
    extras: "",
    active: true,
    badge: "NEW OFFER",
    validTo: ""
  });

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
            <h3>{offer ? 'Refine Offer' : 'Craft New Experience'}</h3>
          </div>
          <button type="button" onClick={onCancel} className="close-btn"><X /></button>
        </div>

        <div className="form-scrollable">
            <div className="form-grid">
                <div className="form-group full">
                    <label>Destination Hotel</label>
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
                    <label>Experience Title</label>
                    <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>

                <div className="form-group">
                    <label>Operational Dates</label>
                    <input type="text" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
                </div>

                <div className="form-group pricing-inputs full">
                    <label>Rates (SGL / DBL / TRP)</label>
                    <div className="rate-fields">
                        <div className="r-field"><span className="r-tag">S</span><input type="number" value={form.prices?.s || ""} onChange={e => setForm({...form, prices: {...form.prices, s: parseInt(e.target.value)}})} /></div>
                        <div className="r-field"><span className="r-tag">D</span><input type="number" value={form.prices?.d || ""} onChange={e => setForm({...form, prices: {...form.prices, d: parseInt(e.target.value)}})} /></div>
                        <div className="r-field"><span className="r-tag">T</span><input type="number" value={form.prices?.t || ""} onChange={e => setForm({...form, prices: {...form.prices, t: parseInt(e.target.value)}})} /></div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Policy Highlight</label>
                    <input type="text" value={form.kids} onChange={e => setForm({...form, kids: e.target.value})} />
                </div>

                <div className="form-group">
                    <label>Validity End Date</label>
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
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [view, setView] = useState("public"); // public | admin
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

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

  const handleAdminToggle = () => {
    if (view === "admin") setView("public");
    else if (isLoggedIn) setView("admin");
    else setView("login");
  };

  return (
    <div className="promo-engine-container">
      {/* Premium Header */}
      <nav className="engine-top-bar">
        <div className="container bar-inner">
            <Link to="/" className="visit-site-link">
                <ArrowLeft size={16} />
                <span>Visit Our Site</span>
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
                    <span>{view === "admin" ? "Exit Admin" : "Operator Panel"}</span>
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
                    <span className="hero-tag">Curated Collection</span>
                    <h1>Friends Group Promotion</h1>
                    <p>Exclusive summer escapes, meticulously selected for the discerning traveler. Studio-quality experiences at unparalleled rates.</p>
                    <div className="hero-stats">
                        <div className="stat"><Clock size={16} /> <span>Summer 2026 Collection</span></div>
                        <div className="stat"><Heart size={16} /> <span>Hand-picked Destinatons</span></div>
                    </div>
                </motion.div>
              </div>
            </section>

            <div className="container">
                <div className="promo-grid-pro">
                    {offers.filter(o => o.active).map(offer => (
                        <OfferCard key={offer.id} offer={offer} />
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
                  <h2>Management Workspace</h2>
                  <p>Control center for all active promotions and seasonal rates.</p>
              </div>
              <button className="add-offer-btn-pro" onClick={() => setIsAdding(true)}>
                <Plus size={18} />
                <span>Create New Promotion</span>
              </button>
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
                  </div>
                  <div className="row-actions">
                    <button onClick={() => setEditing(offer)} className="row-btn edit"><Edit3 size={16} /></button>
                    <button onClick={() => deleteOffer(offer.id)} className="row-btn delete"><Trash2 size={16} /></button>
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
                <p>&copy; 2026 Friends Group Management System v2.1</p>
                <div className="system-status">
                    <div className="status-dot green"></div>
                    <span>Secure Session Active</span>
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
