import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Check, 
  X, 
  ArrowLeft,
  Phone,
  Mail,
  Shield,
  Bed,
  Bath,
  Grid,
  Ruler,
  AlertTriangle
} from 'lucide-react';
import { mockProperties } from '../data/mockProperties';
import { Property } from '../types/property';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Fetch property data
  useEffect(() => {
    // In a real app, we would fetch from an API
    const foundProperty = mockProperties.find(p => p.id === id);
    
    // Simulate API delay
    setTimeout(() => {
      setProperty(foundProperty || null);
      setIsLoading(false);
    }, 500);
    
    // Check if user has an active subscription
    if (isAuthenticated) {
      // In a real app, this would be an API call to check subscription status
      setHasSubscription(user?.role === 'admin' || user?.role === 'broker');
    }
  }, [id, isAuthenticated, user]);
  
  if (isLoading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <div className="animate-pulse flex flex-col w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container-custom py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-warning-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/search" className="btn-primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="hover:text-primary-600">Properties</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{property.title}</span>
        </div>
        
        {/* Property header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-3">
            <span className="text-2xl font-bold text-primary-700">
              {property.price.toLocaleString('en-UG', { 
                style: 'currency', 
                currency: property.currency || 'UGX',
                maximumFractionDigits: 0
              })}
              {property.type === 'rent' && <span className="text-base font-normal text-gray-500">/month</span>}
            </span>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Property image gallery */}
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden mb-3">
            <img 
              src={property.images[activeImageIndex]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Verified badge */}
            {property.isVerified && (
              <div className="absolute top-4 left-4 bg-white py-1 px-3 rounded-full shadow-md flex items-center">
                <Shield className="h-4 w-4 text-success-600 mr-1" />
                <span className="text-sm font-medium">Verified Property</span>
              </div>
            )}
            
            {/* Navigation arrows */}
            <button 
              onClick={() => setActiveImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setActiveImageIndex(prev => (prev + 1) % property.images.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {activeImageIndex + 1} / {property.images.length}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-3">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={cn(
                  "h-16 rounded-md overflow-hidden",
                  activeImageIndex === index ? "ring-2 ring-primary-500" : "opacity-70"
                )}
              >
                <img 
                  src={image} 
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property details */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.propertyType && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Home className="h-6 w-6 text-primary-600 mx-auto mb-1" />
                    <span className="block text-sm text-gray-600">Type</span>
                    <span className="block font-medium capitalize">{property.propertyType}</span>
                  </div>
                )}
                
                {property.bedrooms !== undefined && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="h-6 w-6 text-primary-600 mx-auto mb-1" />
                    <span className="block text-sm text-gray-600">Bedrooms</span>
                    <span className="block font-medium">{property.bedrooms}</span>
                  </div>
                )}
                
                {property.bathrooms !== undefined && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bath className="h-6 w-6 text-primary-600 mx-auto mb-1" />
                    <span className="block text-sm text-gray-600">Bathrooms</span>
                    <span className="block font-medium">{property.bathrooms}</span>
                  </div>
                )}
                
                {property.area !== undefined && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Ruler className="h-6 w-6 text-primary-600 mx-auto mb-1" />
                    <span className="block text-sm text-gray-600">Area</span>
                    <span className="block font-medium">{property.area} sqft</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 mb-4 whitespace-pre-line">
                {property.description}
              </p>
              
              {property.features.length > 0 && (
                <>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                    {property.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-success-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            
            {/* Location info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              
              <div className="h-64 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-gray-500">Map view coming soon</span>
              </div>
              
              <p className="text-gray-700">
                <MapPin className="h-4 w-4 inline-block mr-1" />
                {property.location}
              </p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-20">
              {property.agent && (
                <div className="mb-6">
                  <div className="flex items-center">
                    <img 
                      src={property.agent.avatar} 
                      alt={property.agent.name}
                      className="w-16 h-16 rounded-full mr-4" 
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                      <p className="text-gray-600 capitalize">{property.agent.role}</p>
                      {property.agent.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact info - shown only if subscribed */}
              {hasSubscription ? (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  {property.agent?.phone && (
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 text-primary-600 mr-2" />
                      <a href={`tel:${property.agent.phone}`} className="text-gray-700 hover:text-primary-600">
                        {property.agent.phone}
                      </a>
                    </div>
                  )}
                  {property.agent?.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-primary-600 mr-2" />
                      <a href={`mailto:${property.agent.email}`} className="text-gray-700 hover:text-primary-600">
                        {property.agent.email}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="font-semibold">Contact Details Protected</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Contact information is available to subscribers only. 
                    Unlock access to connect directly with verified property owners.
                  </p>
                  <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="btn-primary w-full"
                  >
                    Unlock Contact Details
                  </button>
                </div>
              )}
              
              {/* Message form */}
              <div>
                <h3 className="font-semibold mb-3">Send Message</h3>
                <form>
                  <div className="mb-3">
                    <textarea 
                      rows={4}
                      placeholder="Hello, I'm interested in this property..."
                      className="input resize-none w-full"
                    />
                  </div>
                  <button type="button" className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
              
              {/* Property details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Listed for:</span>
                  <span className="font-medium">{property.type === 'rent' ? 'Rent' : 'Sale'}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Property ID:</span>
                  <span className="font-medium">PC-{property.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Listed on:</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar properties - Simplified for MVP */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProperties
              .filter(p => 
                p.id !== property.id && 
                p.propertyType === property.propertyType
              )
              .slice(0, 3)
              .map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Unlock Contact Details</h3>
                <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Get direct access to verified property owners and agents. No middlemen, no scams.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">Direct contact with verified property owners</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">Access to phone numbers and email addresses</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">Unlimited property contacts for 30 days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">Choose a Plan</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg border-primary-300 bg-primary-50">
                    <input
                      type="radio"
                      name="plan"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex-grow">
                      <span className="block font-medium">Monthly Subscription</span>
                      <span className="block text-sm text-gray-500">UGX 50,000 / month</span>
                    </div>
                    <span className="font-semibold text-primary-700">Best Value</span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg border-gray-200">
                    <input
                      type="radio"
                      name="plan"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">One-time Purchase</span>
                      <span className="block text-sm text-gray-500">UGX 10,000 / property</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button className="btn-primary">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Subscribe Now
                </button>
                <Link 
                  to="/pricing" 
                  className="text-center text-primary-600 hover:text-primary-800 text-sm font-medium"
                  onClick={() => setIsContactModalOpen(false)}
                >
                  View all subscription plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDetailPage;