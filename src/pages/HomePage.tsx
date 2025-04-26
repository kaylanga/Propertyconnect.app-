import { FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Home, Building, Landmark, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import PropertyCard from '../components/shared/PropertyCard';
import { mockProperties } from '../data/mockProperties';
import HeroSearchForm from '../components/home/HeroSearchForm';
import TestimonialSlider from '../components/home/TestimonialSlider';
import StatsSection from '../components/home/StatsSection';

const HomePage: FC = () => {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Property
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Search through thousands of listings to find the perfect home for you
            </p>
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-2">
                <input
                  type="text"
                  placeholder="Enter location or property type..."
                  className="flex-grow px-4 py-3 text-gray-900 rounded-md focus:outline-none"
                />
                <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Home className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse through thousands of properties across different locations
              </p>
            </div>
            <div className="text-center p-6">
              <Building className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">
                All properties are verified by our team for your peace of mind
              </p>
            </div>
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">
                Find properties in the most sought-after locations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link
              to="/properties"
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <div key={property.id} className="animate-fade-in">
                <PropertyCard property={property} featured={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who found their perfect property
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;