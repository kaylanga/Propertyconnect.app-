import React from 'react';
import { Users, Home, Award, Shield } from 'lucide-react';

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-primary-900 text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose PropertyConnect</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            We're transforming how Ugandans find properties through transparency and trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">10,000+</h3>
            <p className="text-white/80">Satisfied Users</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">5,000+</h3>
            <p className="text-white/80">Verified Properties</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">500+</h3>
            <p className="text-white/80">Certified Agents</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">100%</h3>
            <p className="text-white/80">Verified Listings</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;