import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">About Our Platform</h1>
      
      <div className="max-w-4xl">
        <p className="text-lg text-gray-700 mb-8">
          We're dedicated to revolutionizing the real estate experience in Uganda, making it easier for clients, landlords, and brokers to connect and transact.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            To create a transparent, efficient, and accessible real estate marketplace that empowers all stakeholders with the tools and information they need to make confident property decisions.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700">
            A future where finding, selling, or renting property is a seamless, stress-free experience for everyone in Uganda.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold mb-6">Why Choose Us?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Verified Properties</h3>
            <p className="text-gray-600">
              All properties on our platform undergo rigorous verification to ensure authenticity and accuracy.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Trusted Community</h3>
            <p className="text-gray-600">
              Our vetted network of landlords and brokers provides peace of mind for clients seeking properties.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Advanced Tools</h3>
            <p className="text-gray-600">
              Leverage powerful search filters, virtual tours, and secure payment options for a seamless experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;