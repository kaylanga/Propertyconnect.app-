import React from 'react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        <p className="mt-4 text-xl text-gray-600">
          Your trusted partner in finding the perfect property in Uganda
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mx-auto">
            <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Wide Selection</h3>
          <p className="mt-2 text-gray-600">
            Browse through thousands of properties across Uganda
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mx-auto">
            <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Verified Listings</h3>
          <p className="mt-2 text-gray-600">
            All properties are verified by our team of experts
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mx-auto">
            <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Expert Support</h3>
          <p className="mt-2 text-gray-600">
            Get assistance from our professional team
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
        <p className="mt-4 text-gray-600">
          We are committed to revolutionizing the real estate market in Uganda by providing a transparent, 
          efficient, and user-friendly platform for property buyers, sellers, and renters. Our goal is to 
          make property transactions seamless and accessible to everyone while maintaining the highest 
          standards of professionalism and integrity.
        </p>
      </div>
    </div>
  );
}; 