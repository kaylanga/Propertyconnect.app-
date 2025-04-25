import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-4">
              <Home className="h-8 w-8 mr-2 text-primary-400" />
              <span className="font-bold text-xl">PropertyConnect</span>
            </div>
            <p className="text-gray-400 mb-4">
              The most trusted property marketplace in East Africa. Find verified properties directly from owners and certified agents.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?type=apartment" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/search?type=house" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Houses
                </Link>
              </li>
              <li>
                <Link to="/search?type=land" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Land
                </Link>
              </li>
              <li>
                <Link to="/search?type=commercial" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/search?type=office" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Office Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Plot 45, Kampala Road, Kampala, Uganda
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">+256 783 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">info@propertyconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-800 pt-8 pb-4">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Get the latest property listings and updates directly to your inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-auto flex-grow"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="md:w-1/3">
              <h3 className="text-lg font-semibold mb-2">Download Our App</h3>
              <p className="text-gray-400 mb-4">
                Get our app for the best property browsing experience.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6,13.8l-0.5-0.9l3.9-2.4c0.7-0.4,1-1.3,0.6-2l-2-3.5c-0.4-0.7-1.3-1-2-0.6l-3.9,2.4L13,6.3V2c0-0.8-0.7-1.5-1.5-1.5h-4C6.7,0.5,6,1.2,6,2v4.3l-0.7,0.5L1.4,4.5c-0.7-0.4-1.6-0.1-2,0.6l-2,3.5c-0.4,0.7-0.1,1.6,0.6,2l3.9,2.4l-0.5,0.9l-3.9-2.3c-0.7-0.4-1.6-0.1-2,0.6l-2,3.5c-0.4,0.7-0.1,1.6,0.6,2l3.9,2.4L0.1,17.7c-0.4,0.7-0.1,1.6,0.6,2l2,3.5c0.4,0.7,1.3,1,2,0.6l3.9-2.4L9,22h4c0.8,0,1.5-0.7,1.5-1.5v-0.8l0.7-0.4l3.9,2.4c0.7,0.4,1.6,0.1,2-0.6l2-3.5c0.4-0.7,0.1-1.6-0.6-2L17.6,13.8z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z"></path>
                  </svg>
                  App Store
                </a>
                <a href="#" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.2,20.8c-0.5,0.3-1.1,0.5-1.7,0.5c-0.2,0-0.4,0-0.6-0.1c0,0,0,0,0,0C0.4,21,0,20.5,0,20V4c0-0.5,0.4-1,0.9-1.2c0.2,0,0.4-0.1,0.6-0.1c0.6,0,1.2,0.2,1.7,0.5l11,6.4c1.1,0.6,1.1,2.2,0,2.8L3.2,20.8z"></path>
                    <path d="M18,19.5l-3.8-2.2l-1.4,0.8l4.9,2.8c0.5,0.3,1.1,0.5,1.7,0.5c0.2,0,0.4,0,0.6-0.1c0,0,0,0,0,0c0.5-0.2,0.9-0.7,0.9-1.2v-5.9l-1.4-0.8L18,19.5z"></path>
                    <path d="M18,4.5l1.4,0.8l1.5-0.9c0-0.1,0-0.3,0-0.4c0-0.5-0.4-1-0.9-1.2c-0.2,0-0.4-0.1-0.6-0.1c-0.6,0-1.2,0.2-1.7,0.5L18,4.5z"></path>
                    <path d="M16.6,12.7l1.4-0.8v-4.9l-1.5-0.9l-1.4,0.8L16.6,12.7z"></path>
                  </svg>
                  Play Store
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PropertyConnect. All rights reserved.
          </p>
          <div className="flex flex-wrap space-x-4">
            <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;