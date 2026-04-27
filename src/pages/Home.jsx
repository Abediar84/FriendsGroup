import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import About from '../sections/About';
import Gallery from '../sections/Gallery';
import Testimonials from '../sections/Testimonials';
import Booking from '../sections/Booking';
import Contact from '../sections/Contact';
import CustomCursor from '../components/CustomCursor';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import '../styles/global.css';

function Home() {
    useSmoothScroll();

    return (
        <div className="app-wrapper">
            <CustomCursor />
            <div className="noise-overlay"></div>
            <WhatsAppFloat />
            <Navbar />
            <main>
                <Hero />
                <About />
                <Services />
                <Gallery />
                <Testimonials />
                <Booking />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default Home;
