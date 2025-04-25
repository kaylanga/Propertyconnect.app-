import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div>
          <p className="text-lg text-gray-700 mb-8">
            We're here to help with any questions or concerns about our platform. Reach out to us through any of the following channels.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Mail className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Email</h3>
                <p className="text-gray-600">support@realestate.com</p>
                <p className="text-gray-600">info@realestate.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Phone className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Phone</h3>
                <p className="text-gray-600">+256 700 123 456</p>
                <p className="text-gray-600">+256 800 987 654</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Address</h3>
                <p className="text-gray-600">Plot 45, Kampala Road</p>
                <p className="text-gray-600">Kampala, Uganda</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
          
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                placeholder="johndoe@example.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                placeholder="How can we help you?"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-primary-600 text-white font-medium py-3 px-4 rounded-md hover:bg-primary-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;