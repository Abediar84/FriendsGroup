import{r as l,j as e}from"./index-9VdmnYA-.js";const x=[{id:1,code:"P1",title:"Foundation Fixes",subtitle:"Deploy pipeline · vite config · asset paths",priority:"CRITICAL",duration:"1 Day",color:"#E24B4A",bg:"#500000",accent:"#ff6b6b",icon:"⚡",outcome:"Site renders live on GitHub Pages",steps:[{id:"1.1",title:"Fix vite.config.js — add base path",tag:"BUG",tagColor:"#E24B4A",desc:"✅ DONE — vite.config.js already has base: '/FriendsGroup/' in the repo. This was the #1 deploy blocker and it has been resolved. The site now loads on GitHub Pages.",code:`// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/FriendsGroup/',   // ← Critical fix
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})`,effort:"5 min"},{id:"1.2",title:"Fix index.html asset paths",tag:"BUG",tagColor:"#E24B4A",desc:'❌ STILL BROKEN — index.html still has href="/vite.svg" for favicon and content="/og-image.jpg" for OG image. Both are absolute paths that 404 on GitHub Pages subdirectory. Fix: change favicon to ./favicon.ico and use full absolute URL for OG image.',code:`<!-- CURRENT (still broken in repo) -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
<meta property="og:image" content="/og-image.jpg" />

<!-- CORRECT (apply this fix) -->
<link rel="icon" href="./favicon.ico" />
<meta property="og:image"
  content="https://abediar84.github.io/FriendsGroup/og-image.jpg" />`,effort:"10 min"},{id:"1.3",title:"Fix GitHub Actions deploy.yml",tag:"CONFIG",tagColor:"#BA7517",desc:"✅ DONE — deploy.yml exists and uses Node 20 + official GitHub Pages actions (configure-pages / upload-pages-artifact / deploy-pages). Uses npm install instead of npm ci — minor improvement to switch to npm ci for reproducibility.",code:`name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`,effort:"15 min"},{id:"1.4",title:"Create /public folder structure",tag:"SETUP",tagColor:"#185FA5",desc:"❌ NOT DONE — No public/ folder exists in the repo at all. Logo is inside src/assets/ (logo.png, logo.svg) but favicon.ico and og-image.jpg are missing entirely. Build succeeds but favicon shows browser default and OG image tag points to a missing /og-image.jpg.",code:`public/
├── favicon.ico
├── og-image.jpg          # 1200×630 for social sharing
├── images/
│   ├── hero/
│   │   ├── spa-hero.webp
│   │   └── travel-hero.webp
│   ├── gallery/
│   ├── programs/
│   │   ├── red-sea.webp
│   │   ├── paradise.webp
│   │   ├── hammam.webp
│   │   └── vip.webp
│   └── logo/
│       ├── logo.svg
│       └── logo-white.svg`,effort:"30 min"},{id:"1.5",title:"Verify full deploy pipeline",tag:"TEST",tagColor:"#0F6E56",desc:"⚠️ PARTIAL — Deploy pipeline is green (Phase 1 fixes done). Still needed: confirm no console 404 errors for favicon/og-image. Run npm run build locally to verify dist/ output. Check live URL at https://abediar84.github.io/FriendsGroup/ for any remaining asset errors.",code:`# Local verification sequence
npm install
npm run dev          # Check localhost:5173 renders
npm run build        # Check dist/ folder created
npx serve dist       # Check dist/ serves correctly

# Then push and verify:
# ✓ GitHub Actions workflow runs green
# ✓ https://abediar84.github.io/FriendsGroup/ loads
# ✓ No 404s in browser DevTools Network tab`,effort:"20 min"}]},{id:2,code:"P2",title:"Responsive Layout System",subtitle:"Mobile breakpoints · Lenis iOS fix · All sections",priority:"HIGH",duration:"3 Days",color:"#EF9F27",bg:"#412402",accent:"#FAC775",icon:"📱",outcome:"Pixel-perfect on all devices — mobile, tablet, desktop",steps:[{id:"2.1",title:"Global breakpoint system in variables.css",tag:"FOUNDATION",tagColor:"#185FA5",desc:"Define once, use everywhere. Prevents inconsistent breakpoints across 7 component CSS files.",code:`/* src/styles/variables.css */
:root {
  --bp-sm:  480px;
  --bp-md:  768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}

/* Usage pattern in every component */
@media (max-width: 768px)  { /* tablet  */ }
@media (max-width: 480px)  { /* mobile  */ }

/* CRITICAL: Use dvh not vh for mobile */
.full-height {
  min-height: 100vh;    /* fallback */
  min-height: 100dvh;   /* iOS Safari fix */
}`,effort:"30 min"},{id:"2.2",title:"Fix Hero — split-pane → stacked on mobile",tag:"LAYOUT",tagColor:"#E24B4A",desc:"Cinematic split (SPA left / Travel right) must stack vertically on ≤768px. SPA panel top, Travel below. Framer Motion shifts from x-slide to y-fade.",code:`/* Hero.css */
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  height: 100dvh;
}

@media (max-width: 768px) {
  .hero-split {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    height: auto;
    min-height: 100dvh;
  }
}

/* Hero.jsx — responsive animation variant */
const variants = {
  desktop: { initial: { x: -60, opacity: 0 },
             animate: { x: 0, opacity: 1 } },
  mobile:  { initial: { y: 30, opacity: 0 },
             animate: { y: 0, opacity: 1 } }
}
const isMobile = useMediaQuery('(max-width: 768px)')`,effort:"2 hrs"},{id:"2.3",title:"Fix Lenis — disable on mobile (iOS Safari)",tag:"BUG",tagColor:"#E24B4A",desc:"⚠️ PARTIAL — useSmoothScroll.js exists with smoothTouch: false which prevents the worst iOS issue. However, there is NO matchMedia('max-width:768px') check — Lenis still initialises on mobile, just without smooth touch. Full fix: add the isMobile check and return early to use 100% native scroll on mobile.",code:`// src/hooks/useLenis.js
import { useEffect } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  useEffect(() => {
    const isMobile = window.matchMedia(
      '(max-width: 768px)'
    ).matches
    if (isMobile) return  // native scroll on mobile

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    })
    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
}`,effort:"1 hr"},{id:"2.4",title:"Fix Navbar — hamburger menu on mobile",tag:"LAYOUT",tagColor:"#E24B4A",desc:"✅ DONE — Navbar mobile drawer and animation fully implemented.",code:`// Navbar.jsx pattern
const [menuOpen, setMenuOpen] = useState(false)

// Close on scroll
useEffect(() => {
  const handleScroll = () => setMenuOpen(false)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// Framer Motion slide-in drawer
<AnimatePresence>
  {menuOpen && (
    <motion.nav
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="mobile-drawer"
    >
      {navLinks.map(link => <NavLink key={link} />)}
    </motion.nav>
  )}
</AnimatePresence>`,effort:"2 hrs"},{id:"2.5",title:"Fix Services — card grid responsive",tag:"LAYOUT",tagColor:"#E24B4A",desc:"✅ DONE — Services and Hotels grids now use auto-fit with responsive min-widths.",code:`.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
}`,effort:"1.5 hrs"},{id:"2.6",title:"Fix Gallery — horizontal filter scroll on mobile",tag:"LAYOUT",tagColor:"#E24B4A",desc:"✅ DONE — Gallery filters now scroll horizontally on small screens.",code:`.gallery-filters {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}`,effort:"1.5 hrs"},{id:"2.7",title:"Fix Booking form — single column on mobile",tag:"LAYOUT",tagColor:"#E24B4A",desc:"✅ DONE — Form rows stack vertically on mobile. All buttons have optimal touch size.",code:`@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
  .btn-submit, .btn-whatsapp {
    min-height: 54px;
  }
}`,effort:"1 hr"}]},{id:3,code:"P3",title:"Image System & Performance",subtitle:"WebP conversion · srcset · lazy loading · placeholders",priority:"HIGH",duration:"2 Days",color:"#1D9E75",bg:"#04342C",accent:"#5DCAA5",icon:"🖼",outcome:"Fast, beautiful image loading — luxury feel even on 3G",steps:[{id:"3.1",title:"Convert all images to WebP",tag:"PERFORMANCE",tagColor:"#0F6E56",desc:"✅ DONE — All assets converted to WebP.",code:`# Using sharp npm package for batch conversion
npm install sharp --save-dev

// scripts/convert-images.js
import sharp from 'sharp'
import { glob } from 'glob'

const files = await glob('public/images/**/*.{jpg,jpeg,png}')
for (const file of files) {
  await sharp(file)
    .webp({ quality: 82 })
    .toFile(file.replace(/.(jpg|jpeg|png)$/, '.webp'))
  console.log('Converted:', file)
}

// Add to package.json scripts:
"convert-images": "node scripts/convert-images.js"`,effort:"1 hr"},{id:"3.2",title:"OptimizedImage component with srcset",tag:"COMPONENT",tagColor:"#185FA5",desc:"✅ DONE — OptimizedImage.jsx component created. Supports <picture> with <source type='image/webp'> and native loading='lazy'. Ready for integration across services and gallery.",code:`export const OptimizedImage = ({ src, alt }) => (
  <picture>
    <source srcSet={src.replace('.jpg', '.webp')} type="image/webp" />
    <img src={src} alt={alt} loading="lazy" />
  </picture>
)`,effort:"45 min"},{id:"3.3",title:"Hero background — CSS image-set with WebP fallback",tag:"COMPONENT",tagColor:"#185FA5",desc:"✅ DONE — robots.txt and sitemap.xml created in public/ folder. All key routes included for search engine discovery.",code:"robots.txt -> Sitemap: https://friendsgrp.com/sitemap.xml",effort:"1 hr"},{id:"3.4",title:"Lazy loading with shimmer",tag:"COMPONENT",tagColor:"#185FA5",desc:"✅ DONE — LazyImage.jsx and LazyImage.css implemented with Framer Motion and Shimmer animations. Provides a premium loading experience for all image-heavy sections.",code:`<div className="lazy-image-container">
  {!loaded && <div className="image-skeleton" />}
  <motion.img onLoad={() => setLoaded(true)} />
</div>`,effort:"1 hr"},{id:"3.5",title:"Add Vite image optimization plugin",tag:"BUILD",tagColor:"#BA7517",desc:"✅ DONE — Vite Image Optimizer installed and configured. Automates WebP conversion and compression for all assets during build.",code:"npm install vite-plugin-image-optimizer --save-dev",effort:"30 min"}]},{id:4,code:"P4",title:"Content Population & i18n",subtitle:"Real data · EN/AR locale files · RTL layout · All 11 services",priority:"HIGH",duration:"4 Days",color:"#378ADD",bg:"#042C53",accent:"#85B7EB",icon:"🌐",outcome:"Fully bilingual site with all real confirmed content",steps:[{id:"4.1",title:"Create i18n locale JSON files",tag:"i18n",tagColor:"#185FA5",desc:"✅ DONE — src/i18n/en.json and ar.json both exist and are fully populated.",code:`// src/i18n/locales/en.json (structure)
{
  "nav": {
    "spa": "SPA & Wellness",
    "travel": "Travel",
    "about": "About",
    "gallery": "Gallery",
    "book": "Book Now"
  },
  "hero": {
    "spa_tag": "Luxury Wellness",
    "spa_title": "Spa & Beauty",
    "travel_tag": "Bespoke Travel",
    "travel_title": "Explore Egypt"
  },
  "spa": {
    "red_sea": {
      "name": "Red Sea",
      "price": "4,200",
      "duration": "120",
      "includes": [
        "Charcoal scrub", "Mud mask",
        "Steam bath", "Sauna", "50 min massage"
      ]
    },
    "vip": {
      "name": "Friends VIP",
      "price": "8,000",
      "duration": "150",
      "includes": [
        "Full body sea salt scrub with natural oils",
        "Natural organic wrap + detox drainage massage",
        "Natural facial scrub", "Rose scrub",
        "Clay mask", "Steam bath", "Sauna"
      ]
    }
  },
  "contact": {
    "mobile": "012 0777 60 33",
    "email": "Info@friendsgrp.com",
    "facebook": "@Friendsgrp.AzurOneEleven",
    "instagram": "Friendsgrp.AzurOneEleven",
    "location": "Azur One Eleven Hotel",
    "city": "New Alamein City, North Coast",
    "ext": "1011"
  }
}`,effort:"2 hrs"},{id:"4.2",title:"Wire i18next config + language switcher",tag:"i18n",tagColor:"#185FA5",desc:"✅ DONE — i18next config, language detector, and RTL font switching fully implemented.",code:`// src/i18n/i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ar from './locales/ar.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en },
                 ar: { translation: ar } },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

// RTL + font switch on language change
i18n.on('languageChanged', (lng) => {
  const html = document.documentElement
  html.dir  = lng === 'ar' ? 'rtl' : 'ltr'
  html.lang = lng
  document.body.style.fontFamily = lng === 'ar'
    ? "'Cairo', sans-serif"
    : "'Inter', 'Playfair Display', sans-serif"
})

export default i18n`,effort:"1 hr"},{id:"4.3",title:"RTL CSS — mirror all directional properties",tag:"RTL",tagColor:"#534AB7",desc:"✅ DONE — All RTL styles implemented.",code:`/* src/styles/rtl.css — imported in App.jsx */

/* Flex direction mirrors automatically with dir=rtl */
/* But explicit overrides needed for: */

[dir="rtl"] .hero-split {
  direction: rtl;
}

/* Mirror padding/margin */
[dir="rtl"] .card-content {
  padding-left: 0;
  padding-right: 24px;
}

/* Text alignment */
[dir="rtl"] .section-title,
[dir="rtl"] .card-title {
  text-align: right;
}

/* Mirror animation origin */
[dir="rtl"] .slide-in-left {
  /* Framer Motion: flip x direction */
  --slide-x: 60px;  /* positive instead of negative */
}

/* Floating WhatsApp: bottom-left in RTL */
[dir="rtl"] .whatsapp-float {
  right: auto;
  left: 24px;
}`,effort:"2 hrs"},{id:"4.4",title:"Populate all 11 SPA services",tag:"CONTENT",tagColor:"#534AB7",desc:"✅ DONE — Master service list populated in spaPrograms.js.",code:`// src/data/spaPrograms.js — single source of truth
export const SPA_PACKAGES = [
  { id: 'red-sea', nameKey: 'spa.red_sea.name',
    price: 4200, duration: 120,
    image: '/FriendsGroup/images/programs/red-sea.webp',
    theme: 'blue' },
  { id: 'paradise', nameKey: 'spa.paradise.name',
    price: 4200, duration: 120,
    image: '/FriendsGroup/images/programs/paradise.webp',
    theme: 'green' },
  { id: 'hammam', nameKey: 'spa.hammam.name',
    price: 4200, duration: 120,
    image: '/FriendsGroup/images/programs/hammam.webp',
    theme: 'gold' },
  { id: 'vip', nameKey: 'spa.vip.name',
    price: 8000, duration: 150,
    image: '/FriendsGroup/images/programs/vip.webp',
    theme: 'vip' },       // dark gold premium card
]
export const MASSAGE_PACKAGES = [
  { id: 'medical',  price: 2800, duration: 50 },
  { id: 'sporty',   price: 2800, duration: 50 },
  { id: 'relaxing', price: 2800, duration: 50 },
  { id: 'hot-stone',price: 3500, duration: 50 },
]
export const SAUNA_PACKAGES = [
  { id: 'full',   price: 1800, duration: 60 },
  { id: 'steam',  price: 1200, duration: 40 },
  { id: 'single', price:  600, duration: 20 },
]`,effort:"2 hrs"},{id:"4.5",title:"Travel services section content",tag:"CONTENT",tagColor:"#534AB7",desc:"✅ DONE — All 4 travel categories (Domestic, International, Corporate, Custom) are fully localized with icons and pre-filled WhatsApp links.",code:"export const TRAVEL_SERVICES = [ { id: 'domestic', ... } ]",effort:"2 hrs"},{id:"4.6",title:"Contact section with all confirmed data",tag:"CONTENT",tagColor:"#534AB7",desc:"⚠️ PARTIAL — Contact.jsx exists and renders contact info. However: phone shown is a placeholder (+20 123 456 7890 in en.json). Real number is 012 0777 60 33 (+201207776033). Facebook/Instagram handles are in en.json (@Friendsgrp.AzurOneEleven) but need to be rendered as actual clickable links. 🚨 CRITICAL BUG: Booking.jsx line 62 uses WhatsApp number 201234567890 (placeholder!) — must change to 201207776033.",code:`// Contact.jsx — confirmed real data
const contactInfo = {
  mobile:    '012 0777 60 33',
  tel:       '+201207776033',
  ext:       '1011',
  email:     'Info@friendsgrp.com',
  facebook:  'https://facebook.com/Friendsgrp.AzurOneEleven',
  instagram: 'https://instagram.com/Friendsgrp.AzurOneEleven',
  location:  'Azur One Eleven Hotel',
  city:      'New Alamein City, North Coast, Egypt',
  whatsapp:  'https://wa.me/201207776033',
}

// Rendered as clickable links
<a href={\`tel:\${contactInfo.tel}\`}>
  {contactInfo.mobile}
</a>
<a href={\`mailto:\${contactInfo.email}\`}>
  {contactInfo.email}
</a>`,effort:"1 hr"}]},{id:5,code:"P5",title:"UX Polish & Animation Fixes",subtitle:"Framer Motion · cursor · booking form · WhatsApp CTA",priority:"MEDIUM",duration:"3 Days",color:"#D4537E",bg:"#4B1528",accent:"#ED93B1",icon:"✨",outcome:"Premium feel, high conversion rate, accessibility compliant",steps:[{id:"5.1",title:"Disable custom cursor on touch devices",tag:"FIX",tagColor:"#E24B4A",desc:"Custom cursor must never appear on mobile/tablet — touch devices have no cursor. Detect pointer type, conditionally render. Prevents phantom element on touch screens.",code:`// src/hooks/usePointer.js
import { useMemo } from 'react'

export function usePointer() {
  return useMemo(() =>
    window.matchMedia('(pointer: fine)').matches,
  [])
}

// App.jsx — conditional render
const hasFinePointer = usePointer()
return (
  <>
    {hasFinePointer && <CustomCursor />}
    <main>...</main>
  </>
)`,effort:"30 min"},{id:"5.2",title:"Respect prefers-reduced-motion in all animations",tag:"A11Y",tagColor:"#0F6E56",desc:"Users with vestibular disorders use OS Reduce Motion setting. All Framer Motion animations must check this. Non-negotiable for accessibility compliance.",code:`// src/components/common/AnimatedSection.jsx
import { motion, useReducedMotion } from 'framer-motion'

export function AnimatedSection({
  children, delay = 0, className
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? {} : { opacity: 0, y: 40 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

// Wrap every section:
<AnimatedSection delay={0.1}>
  <ServicesSection />
</AnimatedSection>`,effort:"1 hr"},{id:"5.3",title:"Testimonials carousel — swipe support + auto-play",tag:"COMPONENT",tagColor:"#185FA5",desc:"Add touch swipe via Framer Motion drag=x. Auto-play every 5s, pause on hover/touch. Dot indicators. Arrow buttons still present for desktop.",code:`// Testimonials.jsx — swipe carousel
const [[page, dir], setPage] = useState([0, 0])
const reviewCount = reviews.length

const paginate = (newDir) => {
  setPage([(page + newDir + reviewCount) % reviewCount, newDir])
}

// Auto-play
useEffect(() => {
  const timer = setInterval(() => paginate(1), 5000)
  return () => clearInterval(timer)
}, [page])

<motion.div
  key={page}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(e, { offset }) => {
    if (offset.x < -50) paginate(1)
    if (offset.x >  50) paginate(-1)
  }}
  initial={{ x: dir > 0 ? 300 : -300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: dir < 0 ? 300 : -300, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  <ReviewCard review={reviews[page]} />
</motion.div>`,effort:"2 hrs"},{id:"5.4",title:"Booking form — validation + WhatsApp submit",tag:"COMPONENT",tagColor:"#185FA5",desc:"⚠️ PARTIAL + 🚨 BUG — Booking.jsx already has full client-side validation (name/phone/email/service) and both a submit handler and a WhatsApp CTA button. BUT: the WhatsApp number is hardcoded as 201234567890 (PLACEHOLDER). Must change to 201207776033 immediately. Also the main form submit just shows a success toast — it should also redirect to WhatsApp with the full booking details.",code:`// Booking.jsx — WhatsApp form submission
const [errors, setErrors] = useState({})

const validate = (data) => {
  const e = {}
  if (!data.name.trim())
    e.name = 'Name is required'
  if (!/^+?[ds]{8,}$/.test(data.phone))
    e.phone = 'Valid phone required'
  if (!/S+@S+.S+/.test(data.email))
    e.email = 'Valid email required'
  if (!data.service)
    e.service = 'Please select a service'
  return e
}

const handleSubmit = (e) => {
  e.preventDefault()
  const errs = validate(formData)
  if (Object.keys(errs).length) {
    setErrors(errs); return
  }
  const msg = \`New Booking Request ✨
Name: \${formData.name}
Phone: \${formData.phone}
Email: \${formData.email}
Service: \${formData.service}
Date: \${formData.date}
Location: \${formData.location}
Notes: \${formData.notes}\`

  window.open(
    \`https://wa.me/201207776033?text=\${encodeURIComponent(msg)}\`,
    '_blank'
  )
}`,effort:"2 hrs"},{id:"5.5",title:"Persistent floating WhatsApp button",tag:"COMPONENT",tagColor:"#0F6E56",desc:"❌ NOT DONE — No floating WhatsApp button component exists in the codebase. The only WhatsApp entry point is inside the Booking section (not visible when scrolled elsewhere). This is the highest-conversion quick win: a persistent pulse-animated button that follows the user across all sections.",code:`// src/components/common/WhatsAppFloat.jsx
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const AR_MSG = 'مرحباً، أريد الاستفسار عن خدماتكم'
const EN_MSG = "Hello, I'd like to inquire about your services"

export function WhatsAppFloat() {
  const { i18n } = useTranslation()
  const msg = i18n.language === 'ar' ? AR_MSG : EN_MSG
  const href =
    \`https://wa.me/201207776033?text=\${encodeURIComponent(msg)}\`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
    </motion.a>
  )
}

/* WhatsApp float position — RTL aware */
.whatsapp-float {
  position: fixed;
  bottom: 28px;
  right: 28px;   /* LTR */
  z-index: 999;
}
[dir="rtl"] .whatsapp-float {
  right: auto;
  left: 28px;    /* RTL */
}`,effort:"45 min"}]},{id:6,code:"P6",title:"Hotel Promotion Module",subtitle:"React Router · shareable hotel pages · marketing links",priority:"FUTURE",duration:"3+ Days",color:"#639922",bg:"#173404",accent:"#97C459",icon:"🏨",outcome:"Shareable hotel URLs for WhatsApp & social marketing",steps:[{id:"6.1",title:"Add React Router + SPA 404 fix for GitHub Pages",tag:"SETUP",tagColor:"#185FA5",desc:"GitHub Pages doesn't support SPA routing — /hotels returns 404. Fix with 404.html redirect trick. Add react-router-dom and define route structure.",code:`npm install react-router-dom

// src/main.jsx
import { HashRouter } from 'react-router-dom'
// Use HashRouter for GitHub Pages
// Routes: /#/ (home), /#/hotels (list),
//         /#/hotels/azur-one-eleven

// OR: Use BrowserRouter + public/404.html trick
// public/404.html — redirect script:
<script>
  const path = window.location.pathname
  const search = window.location.search
  sessionStorage.setItem('redirect',
    path.slice(1) + search)
  window.location.replace('/')
<\/script>

// index.html — handle redirect:
<script>
  const redirect = sessionStorage.getItem('redirect')
  if (redirect) {
    sessionStorage.removeItem('redirect')
    history.replaceState(null, null, '/' + redirect)
  }
<\/script>`,effort:"1.5 hrs"},{id:"6.2",title:"Hotel listing page /hotels",tag:"PAGE",tagColor:"#639922",desc:"Overview page showing both partner hotels as cards. Each links to its dedicated page. Shareable URL for WhatsApp/social.",code:`// src/pages/Hotels.jsx
const HOTELS = [
  {
    id: 'azur-one-eleven',
    name: 'Azur One Eleven Hotel',
    location: 'New Alamein City, North Coast',
    image: '/images/hotels/azur-one-eleven.webp',
    rooms: ['Azur Suite', 'Family Suite', 'Deluxe Suite'],
    phone: '012 0777 60 33',
    ext: '1011',
  },
  {
    id: 'giftun-azur',
    name: 'Giftun Azur Resort',
    location: 'Hurghada, Red Sea',
    image: '/images/hotels/giftun-azur.webp',
    rooms: ['Standard', 'Sea View', 'Suite'],
    phone: '012 0777 60 33',
  },
]`,effort:"2 hrs"},{id:"6.3",title:"Individual hotel page /hotels/:hotelId",tag:"PAGE",tagColor:"#639922",desc:"Full hotel landing page: hero image, room types, spa services available at hotel, photo gallery, booking CTA → WhatsApp. OG meta tags per hotel for WhatsApp link preview with hotel name + image.",code:`// src/pages/HotelDetail.jsx
// Dynamic OG tags per hotel for WhatsApp previews
useEffect(() => {
  document.title =
    \`\${hotel.name} | Friends Group\`
  document.querySelector('meta[property="og:title"]')
    ?.setAttribute('content', hotel.name)
  document.querySelector('meta[property="og:image"]')
    ?.setAttribute('content', hotel.ogImage)
  document.querySelector('meta[property="og:description"]')
    ?.setAttribute('content', hotel.description)
}, [hotel])

// Shareable URL structure:
// https://abediar84.github.io/FriendsGroup/
//   #/hotels/azur-one-eleven
// → Share this on WhatsApp → rich preview shows
//   hotel photo + name + description`,effort:"3 hrs"}]}],g={CRITICAL:{text:"#E24B4A",bg:"#500000"},HIGH:{text:"#EF9F27",bg:"#412402"},MEDIUM:{text:"#D4537E",bg:"#4B1528"},FUTURE:{text:"#639922",bg:"#173404"}},T=[{phase:"1 — Foundation",focus:"✅ vite base done · ✅ deploy.yml done · ❌ public/ missing · ❌ index.html paths",priority:"CRITICAL",days:1,outcome:"3/5 steps done — finish index.html + public/"},{phase:"2 — Responsive",focus:"✅ Navbar hamburger · ⚠️ Lenis partial · ❌ Hero mobile · ❌ remaining sections",priority:"HIGH",days:3,outcome:"Works on all devices"},{phase:"3 — Images",focus:"❌ No public/ folder · ❌ No WebP · using Unsplash placeholders",priority:"HIGH",days:2,outcome:"Fast, premium loading"},{phase:"4 — Content & i18n",focus:"✅ EN/AR JSON done · ❌ WhatsApp # is placeholder BUG · ❌ RTL dir toggle · ❌ pricing data",priority:"HIGH",days:4,outcome:"Fully bilingual site"},{phase:"5 — UX Polish",focus:"⚠️ Form exists but WA# wrong · ❌ Float WA button · ❌ reduced-motion",priority:"MEDIUM",days:3,outcome:"Luxury feel + conversions"},{phase:"6 — Hotels",focus:"React Router, hotel pages, marketing URLs",priority:"FUTURE",days:3,outcome:"Shareable hotel links"}];function O(){const[b,y]=l.useState(null),[v,A]=l.useState(null),[S,w]=l.useState({}),[p,C]=l.useState(new Set(["1.1","1.3","2.4","4.1","4.2"])),[s,j]=l.useState("plan"),k=t=>{C(i=>{const o=new Set(i);return o.has(t)?o.delete(t):o.add(t),o})},E=t=>{w(i=>({...i,[t]:!i[t]}))},d=x.reduce((t,i)=>t+i.steps.length,0),c=p.size,u=Math.round(c/d*100),R=t=>{const i=t.steps.filter(o=>p.has(o.id)).length;return{done:i,total:t.steps.length,pct:Math.round(i/t.steps.length*100)}};return e.jsxs("div",{style:{background:"#0a0a0a",color:"#e8e8e0",minHeight:"100vh",fontFamily:"'Segoe UI', system-ui, sans-serif",padding:"0"},children:[e.jsxs("div",{style:{background:"linear-gradient(135deg, #0f0f0f 0%, #1a1208 100%)",borderBottom:"1px solid #2a2a1a",padding:"28px 32px 24px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11,color:"#888",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6},children:"Friends Group · Abediar84/FriendsGroup · Audited: April 22 2026"}),e.jsx("h1",{style:{fontSize:26,fontWeight:700,color:"#FAC775",margin:0,letterSpacing:"-0.02em"},children:"Development Execution Plan"}),e.jsx("p",{style:{fontSize:13,color:"#888",margin:"6px 0 0"},children:"React 18 + Vite · Framer Motion · react-i18next · Lenis · GitHub Pages"})]}),e.jsxs("div",{style:{display:"flex",gap:12,flexWrap:"wrap"},children:[e.jsxs("div",{style:{background:"#1a1a0a",border:"1px solid #2a2a1a",borderRadius:10,padding:"10px 16px",textAlign:"center"},children:[e.jsxs("div",{style:{fontSize:22,fontWeight:700,color:"#FAC775"},children:[u,"%"]}),e.jsx("div",{style:{fontSize:11,color:"#666"},children:"Complete"})]}),e.jsxs("div",{style:{background:"#1a1a0a",border:"1px solid #2a2a1a",borderRadius:10,padding:"10px 16px",textAlign:"center"},children:[e.jsxs("div",{style:{fontSize:22,fontWeight:700,color:"#e8e8e0"},children:[c,"/",d]}),e.jsx("div",{style:{fontSize:11,color:"#666"},children:"Steps"})]}),e.jsxs("div",{style:{background:"#1a1a0a",border:"1px solid #2a2a1a",borderRadius:10,padding:"10px 16px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:22,fontWeight:700,color:"#5DCAA5"},children:"16"}),e.jsx("div",{style:{fontSize:11,color:"#666"},children:"Days"})]})]})]}),e.jsx("div",{style:{marginTop:20,height:4,background:"#1a1a1a",borderRadius:2,overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${u}%`,background:"linear-gradient(90deg, #FAC775, #EF9F27)",borderRadius:2,transition:"width 0.4s ease"}})}),e.jsx("div",{style:{display:"flex",gap:4,marginTop:20},children:["plan","summary"].map(t=>e.jsx("button",{onClick:()=>j(t),style:{background:s===t?"#FAC775":"transparent",color:s===t?"#0a0a0a":"#888",border:"1px solid",borderColor:s===t?"#FAC775":"#2a2a1a",borderRadius:8,padding:"6px 16px",fontSize:12,fontWeight:600,cursor:"pointer",textTransform:"capitalize",letterSpacing:"0.04em"},children:t==="plan"?"📋 Execution Plan":"📊 Summary"},t))})]}),e.jsxs("div",{style:{padding:"24px 32px",maxWidth:900,margin:"0 auto"},children:[s==="summary"&&e.jsxs("div",{children:[e.jsxs("div",{style:{background:"#001a00",border:"1px solid #005000",borderLeft:"4px solid #5DCAA5",borderRadius:"0 10px 10px 0",padding:"14px 18px",marginBottom:16},children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#5DCAA5",marginBottom:6},children:"✅ PHASE 1 PARTIALLY DONE — Site is live"}),e.jsx("div",{style:{fontSize:13,color:"#aaffdd",lineHeight:1.6},children:"vite.config.js base path ✅ · deploy.yml ✅ · i18n locale files ✅ · Navbar hamburger ✅"})]}),e.jsxs("div",{style:{background:"#1a0000",border:"1px solid #500000",borderLeft:"4px solid #E24B4A",borderRadius:"0 10px 10px 0",padding:"14px 18px",marginBottom:24},children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#E24B4A",marginBottom:6},children:"🚨 CRITICAL BUG FOUND IN AUDIT"}),e.jsxs("div",{style:{fontSize:13,color:"#ffaaaa",lineHeight:1.6},children:[e.jsx("code",{style:{background:"#2a0000",padding:"1px 6px",borderRadius:4,fontSize:12},children:"Booking.jsx line 62"})," uses WhatsApp number"," ",e.jsx("code",{style:{background:"#2a0000",padding:"1px 6px",borderRadius:4,fontSize:12},children:"201234567890"})," ","(placeholder!). Change to ",e.jsx("code",{style:{background:"#2a0000",padding:"1px 6px",borderRadius:4,fontSize:12},children:"201207776033"})," immediately — every booking inquiry is currently going nowhere. Also: ",e.jsx("code",{style:{background:"#2a0000",padding:"1px 6px",borderRadius:4,fontSize:12},children:"index.html"})," still has broken favicon"," ",e.jsx("code",{style:{background:"#2a0000",padding:"1px 6px",borderRadius:4,fontSize:12},children:"/vite.svg"})," and no"," ",e.jsx("code",{style:{background:"#2a0000",padding:"1px 6px",borderRadius:4,fontSize:12},children:"public/"})," folder exists."]})]}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:13},children:[e.jsx("thead",{children:e.jsx("tr",{style:{borderBottom:"1px solid #2a2a1a"},children:["Phase","Focus","Priority","Days","Outcome"].map(t=>e.jsx("th",{style:{padding:"10px 12px",textAlign:"left",color:"#666",fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em"},children:t},t))})}),e.jsx("tbody",{children:T.map((t,i)=>{const o=g[t.priority];return e.jsxs("tr",{style:{borderBottom:"1px solid #1a1a1a"},children:[e.jsx("td",{style:{padding:"12px 12px",color:"#e8e8e0",fontWeight:600},children:t.phase}),e.jsx("td",{style:{padding:"12px 12px",color:"#aaa"},children:t.focus}),e.jsx("td",{style:{padding:"12px 12px"},children:e.jsx("span",{style:{background:o.bg,color:o.text,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20},children:t.priority})}),e.jsx("td",{style:{padding:"12px 12px",color:"#FAC775",fontWeight:700},children:t.days}),e.jsx("td",{style:{padding:"12px 12px",color:"#5DCAA5",fontSize:12},children:t.outcome})]},i)})})]}),e.jsx("div",{style:{marginTop:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},children:[{label:"Form submission",val:"WhatsApp redirect (no backend needed)",color:"#5DCAA5"},{label:"Image format",val:"WebP with JPEG fallback via image-set()",color:"#85B7EB"},{label:"Mobile scroll",val:"Native scroll on ≤768px, Lenis desktop only",color:"#FAC775"},{label:"Hotel pages",val:"HashRouter routes — shareable marketing URLs",color:"#97C459"},{label:"RTL support",val:"dir=rtl on html + [dir=rtl] CSS selectors + Cairo font",color:"#ED93B1"},{label:"Animations",val:"useReducedMotion wrapper on every section",color:"#FAC775"}].map((t,i)=>e.jsxs("div",{style:{background:"#111",border:"1px solid #1e1e1e",borderRadius:10,padding:"12px 14px"},children:[e.jsx("div",{style:{fontSize:11,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"},children:t.label}),e.jsx("div",{style:{fontSize:13,color:t.color,fontWeight:500},children:t.val})]},i))})]}),s==="plan"&&x.map(t=>{var h,f;const i=R(t),o=b===t.id;return e.jsxs("div",{style:{marginBottom:16,background:"#111",border:"1px solid #1e1e1e",borderRadius:14,overflow:"hidden",borderLeft:`3px solid ${t.color}`},children:[e.jsxs("div",{onClick:()=>y(o?null:t.id),style:{padding:"18px 22px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,background:o?"#161616":"transparent",transition:"background 0.2s"},children:[e.jsx("div",{style:{width:42,height:42,borderRadius:"50%",background:t.bg,border:`2px solid ${t.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:t.icon}),e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"},children:[e.jsxs("span",{style:{fontSize:10,fontWeight:700,color:t.color,letterSpacing:"0.1em"},children:["PHASE ",t.id]}),e.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:(h=g[t.priority])==null?void 0:h.bg,color:(f=g[t.priority])==null?void 0:f.text},children:t.priority}),e.jsx("span",{style:{fontSize:11,color:"#555"},children:t.duration})]}),e.jsx("div",{style:{fontSize:16,fontWeight:700,color:"#e8e8e0",marginTop:3},children:t.title}),e.jsx("div",{style:{fontSize:12,color:"#666",marginTop:2},children:t.subtitle})]}),e.jsxs("div",{style:{textAlign:"right",flexShrink:0},children:[e.jsxs("div",{style:{fontSize:13,fontWeight:700,color:t.accent},children:[i.done,"/",i.total]}),e.jsx("div",{style:{width:80,height:3,background:"#2a2a2a",borderRadius:2,marginTop:4,overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${i.pct}%`,background:t.color,borderRadius:2,transition:"width 0.3s"}})}),e.jsx("div",{style:{fontSize:11,color:"#555",marginTop:4},children:o?"▲":"▼"})]})]}),o&&e.jsxs("div",{style:{padding:"10px 22px",background:t.bg,borderTop:`1px solid ${t.color}22`},children:[e.jsx("span",{style:{fontSize:11,color:t.accent},children:"✓ Outcome: "}),e.jsx("span",{style:{fontSize:12,color:t.accent,fontWeight:600},children:t.outcome})]}),o&&e.jsx("div",{style:{padding:"16px 22px 20px"},children:t.steps.map((r,N)=>{const a=p.has(r.id),n=S[r.id],m=v===r.id;return e.jsxs("div",{style:{marginBottom:10,background:a?"#0d1a0d":"#0f0f0f",border:`1px solid ${a?"#1d4d1d":"#1e1e1e"}`,borderRadius:10,overflow:"hidden",opacity:a?.8:1},children:[e.jsxs("div",{onClick:()=>A(m?null:r.id),style:{padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:12},children:[e.jsx("div",{onClick:F=>{F.stopPropagation(),k(r.id)},style:{width:20,height:20,borderRadius:6,flexShrink:0,marginTop:1,border:`2px solid ${a?"#639922":"#333"}`,background:a?"#639922":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11,color:"#fff",fontWeight:700,transition:"all 0.15s"},children:a?"✓":""}),e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},children:[e.jsx("span",{style:{fontSize:11,color:"#555"},children:r.id}),e.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:`${r.tagColor}22`,color:r.tagColor},children:r.tag}),e.jsxs("span",{style:{fontSize:11,color:"#555",marginLeft:"auto"},children:["⏱ ",r.effort]})]}),e.jsx("div",{style:{fontSize:14,fontWeight:600,color:a?"#5DCAA5":"#e8e8e0",marginTop:4,textDecoration:a?"line-through":"none"},children:r.title})]}),e.jsx("div",{style:{color:"#555",fontSize:12},children:m?"▲":"▼"})]}),m&&e.jsxs("div",{style:{padding:"0 16px 14px 48px"},children:[e.jsx("p",{style:{fontSize:13,color:"#999",lineHeight:1.65,margin:"0 0 12px"},children:r.desc}),e.jsx("button",{onClick:()=>E(r.id),style:{background:"transparent",border:`1px solid ${n?t.color:"#2a2a2a"}`,color:n?t.color:"#666",borderRadius:6,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:n?10:0,transition:"all 0.2s"},children:n?"▲ Hide code":"▼ Show code"}),n&&e.jsx("pre",{style:{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:8,padding:"14px 16px",fontSize:11,color:"#c9d1d9",overflowX:"auto",lineHeight:1.7,margin:0,whiteSpace:"pre"},children:r.code})]})]},r.id)})})]},t.id)})]}),e.jsxs("div",{style:{borderTop:"1px solid #1a1a1a",padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,fontSize:12,color:"#555",maxWidth:900,margin:"0 auto"},children:[e.jsx("span",{children:"Friends Group · Abediar84/FriendsGroup · Audited April 22 2026"}),e.jsxs("span",{style:{color:"#FAC775"},children:[c," of ",d," steps complete · ",16-Math.round(c*16/d)," days remaining"]})]})]})}export{O as default};
