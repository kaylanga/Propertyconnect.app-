import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Building, Landmark, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import PropertyCard from '../components/shared/PropertyCard';
import { mockProperties } from '../data/mockProperties';
import HeroSearchForm from '../components/home/HeroSearchForm';
import TestimonialSlider from '../components/home/TestimonialSlider';
import StatsSection from '../components/home/StatsSection';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  
  // Filter featured properties
  const featuredProperties = mockProperties
    .filter(property => property.isFeatured)
    .slice(0, 6);

  // Filter popular locations (would come from API in real app)
  const popularLocations = [
    { id: 1, name: 'Kampala', count: 235, image: 'https://images.pexels.com/photos/3998022/pexels-photo-3998022.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 2, name: 'Entebbe', count: 124, image: 'https://images.pexels.com/photos/9482492/pexels-photo-9482492.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 3, name: 'Jinja', count: 78, image: 'https://images.pexels.com/photos/4450329/pexels-photo-4450329.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 4, name: 'Mbarara', count: 93, image: 'https://images.pexels.com/photos/2562596/pexels-photo-2562596.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 lg:pb-32 bg-gradient-to-r from-primary-800 to-primary-900 text-white"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(3, 105, 161, 0.9), rgba(12, 74, 110, 0.8)), url(https://images.pexels.com/photos/1662159/pexels-photo-1662159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Property in Uganda
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Connect directly with verified property owners and trusted agents. 
              No middlemen, no scams - just honest real estate.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
            <div className="flex mb-6 border-b">
              <button
                className={`pb-3 px-6 font-medium text-lg ${activeTab === 'buy' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('buy')}
              >
                Buy
              </button>
              <button
                className={`pb-3 px-6 font-medium text-lg ${activeTab === 'rent' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('rent')}
              >
                Rent
              </button>
            </div>
            
            <HeroSearchForm type={activeTab} />
          </div>
        </div>

        {/* Curved bottom shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#f9fafb">
            <path d="M0,50 C300,110 900,-10 1440,80 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our hand-picked selection of top properties available across Uganda, 
              all verified and ready for you to explore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(property => (
              <div key={property.id} className="animate-fade-in">
                <PropertyCard property={property} featured={true} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button 
              onClick={() => navigate('/search')}
              className="btn-primary inline-flex items-center"
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How PropertyConnect Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to find verified properties directly from owners and certified agents, 
              eliminating the middlemen and scams common in East African real estate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search Properties</h3>
              <p className="text-gray-600">
                Browse our extensive collection of verified properties across Uganda and filter based on your preferences.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-accent-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Directly</h3>
              <p className="text-gray-600">
                For a small fee, gain direct access to property owners or certified agents, with no middlemen involved.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-secondary-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Your Property</h3>
              <p className="text-gray-600">
                View properties with confidence, knowing all listings are verified and legitimate, saving you time and money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Locations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore properties in these popular Ugandan locations, each with their own unique charm and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularLocations.map(location => (
              <div 
                key={location.id} 
                className="rounded-lg overflow-hidden shadow-md relative group cursor-pointer"
                onClick={() => navigate(`/search?location=${location.name}`)}
              >
                <div className="relative h-60">
                  <img 
                    src={location.image} 
                    alt={location.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <h3 className="text-xl font-semibold">{location.name}</h3>
                    </div>
                    <p className="text-white/90 text-sm">{location.count} properties</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Property Types */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Property Type</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect property that suits your needs, whether it's an apartment, house, land, or commercial space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="p-6 text-center cursor-pointer rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
              onClick={() => navigate('/search?type=apartment')}
            >
              <div className="bg-primary-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Apartments</h3>
              <p className="text-gray-600">Find modern apartments in prime locations</p>
            </div>

            <div 
              className="p-6 text-center cursor-pointer rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
              onClick={() => navigate('/search?type=house')}
            >
              <div className="bg-secondary-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Houses</h3>
              <p className="text-gray-600">Discover family homes with space and comfort</p>
            </div>

            <div 
              className="p-6 text-center cursor-pointer rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
              onClick={() => navigate('/search?type=land')}
            >
              <div className="bg-accent-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Land</h3>
              <p className="text-gray-600">Invest in plots with genuine, verified titles</p>
            </div>

            <div 
              className="p-6 text-center cursor-pointer rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
              onClick={() => navigate('/search?type=commercial')}
            >
              <div className="bg-success-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Landmark className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Commercial</h3>
              <p className="text-gray-600">Find spaces for your business to thrive</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSlider />

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of satisfied users who found their dream properties without the hassle of middlemen or scams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/search')}
                className="btn bg-white text-primary-800 hover:bg-gray-100 text-lg px-8 py-3"
              >
                Browse Properties
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="btn bg-accent-500 text-white hover:bg-accent-600 text-lg px-8 py-3"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;