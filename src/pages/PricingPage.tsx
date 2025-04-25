import React from 'react';
import { CheckCircle } from 'lucide-react';

const PricingPage: React.FC = () => {
  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'For clients looking for properties',
      features: [
        'Browse all properties',
        'Save favorite properties',
        'Basic search filters',
        'View property details',
        'Limited contact reveals (3/month)'
      ],
      isMostPopular: false,
      buttonText: 'Get Started',
      buttonVariant: 'outline'
    },
    {
      name: 'Premium',
      price: '50,000 UGX',
      period: 'per month',
      description: 'For serious property seekers',
      features: [
        'All Basic features',
        'Unlimited contact reveals',
        'Advanced search filters',
        'Email alerts for new properties',
        'Priority customer support',
        'No advertisements'
      ],
      isMostPopular: true,
      buttonText: 'Subscribe Now',
      buttonVariant: 'solid'
    },
    {
      name: 'Landlord',
      price: '200,000 UGX',
      period: 'per month',
      description: 'For property owners',
      features: [
        'List up to 10 properties',
        'Property verification badge',
        'Featured property placement',
        'Professional photography services',
        'Detailed analytics dashboard',
        'Priority customer support'
      ],
      isMostPopular: false,
      buttonText: 'Get Started',
      buttonVariant: 'outline'
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans come with a 7-day free trial.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg overflow-hidden ${
              plan.isMostPopular 
                ? 'shadow-xl border-2 border-primary-500 relative' 
                : 'shadow-md border border-gray-200'
            }`}
          >
            {plan.isMostPopular && (
              <div className="bg-primary-500 text-white text-center py-1 font-medium">
                Most Popular
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-500 ml-2">{plan.period}</span>}
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full rounded-md py-3 px-4 font-medium transition duration-300 ${
                  plan.buttonVariant === 'solid'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border border-primary-600 text-primary-600 hover:bg-primary-50'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-medium">Can I change plans later?</h3>
            <p className="text-gray-600 mt-2">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the beginning of your next billing cycle.
            </p>
          </div>
          
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-medium">Is there a contract or commitment?</h3>
            <p className="text-gray-600 mt-2">
              No, all our plans are on a month-to-month basis. You can cancel anytime without any cancellation fees.
            </p>
          </div>
          
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-medium">What payment methods do you accept?</h3>
            <p className="text-gray-600 mt-2">
              We accept credit/debit cards, mobile money (MTN and Airtel), and bank transfers for all paid plans.
            </p>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-medium">Can I get a refund if I'm not satisfied?</h3>
            <p className="text-gray-600 mt-2">
              We offer a 7-day money-back guarantee if you're not completely satisfied with our premium services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;