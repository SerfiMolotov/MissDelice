import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';
import MenuPreviewSection from "../components/home/MenuPreviewSection.jsx";

const Home = () => {
    return (
        <div>
            <HeroSection />
            <AboutSection />
            <MenuPreviewSection/>
            <ContactSection />
        </div>
    );
};

export default Home;