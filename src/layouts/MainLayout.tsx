import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { getCurrencyFromLocation } from '../utils/location';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [currency, setCurrency] = useState('UGX');
  const [language, setLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate location detection
  useEffect(() => {
    // In a real app, we would use geolocation or IP-based detection
    // For demo purposes, we're using a static value
    const detectedCurrency = getCurrencyFromLocation('UG');
    setCurrency(detectedCurrency);
    
    // Simulate language detection
    // In a real app, we would use browser language or IP-based detection
    setLanguage(navigator.language.split('-')[0] || 'en');
    
    // Store values in localStorage for persistence
    localStorage.setItem('propertyConnectCurrency', detectedCurrency);
    localStorage.setItem('propertyConnectLanguage', language);
  }, []);

  // For homepage, use transparent navbar that changes on scroll
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        transparent={isHomePage && !isScrolled}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;