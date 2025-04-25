import React, { useState } from 'react';

// Testimonial type
interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  content: string;
  avatar: string;
}

// Sample testimonials
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'David Mukasa',
    role: 'Property Buyer',
    location: 'Kampala',
    content: 'I spent months looking for a house, dealing with brokers who showed me properties that didn\'t match what I wanted. With PropertyConnect, I found my dream home in just 2 weeks. The direct connection to the owner saved me millions in broker fees!',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    name: 'Sarah Namakula',
    role: 'Apartment Renter',
    location: 'Entebbe',
    content: 'As a woman searching for an apartment alone, I always felt vulnerable dealing with random brokers. PropertyConnect verified everything for me, and I could chat directly with the landlord before viewing. I feel safe in my new place!',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    name: 'James Odhiambo',
    role: 'Land Investor',
    location: 'Jinja',
    content: 'I was scammed twice before trying to buy land. The verification process on PropertyConnect helped me confirm the title was legitimate, and I finally invested with confidence. The small fee I paid was worth every shilling.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 4,
    name: 'Grace Atuhaire',
    role: 'Landlord',
    location: 'Mbarara',
    content: 'As a landlord with multiple properties, I was tired of dealing with brokers who misrepresented my apartments. Now I list directly on PropertyConnect and connect with serious tenants. My vacancies get filled faster!',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
];

const TestimonialSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from people who have found their perfect properties through PropertyConnect.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial card */}
          <div className="bg-white rounded-xl shadow-md p-8 md:p-10">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img 
                  src={testimonials[activeIndex].avatar} 
                  alt={testimonials[activeIndex].name}
                  className="w-20 h-20 rounded-full border-4 border-primary-100" 
                />
                <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  "
                </div>
              </div>
            </div>
            
            <blockquote className="text-center mb-6">
              <p className="text-xl text-gray-800 italic leading-relaxed mb-6">
                "{testimonials[activeIndex].content}"
              </p>
              <footer>
                <div className="font-bold text-lg text-gray-900">{testimonials[activeIndex].name}</div>
                <div className="text-gray-600">
                  {testimonials[activeIndex].role}, {testimonials[activeIndex].location}
                </div>
              </footer>
            </blockquote>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? 'bg-primary-600 w-6' : 'bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;