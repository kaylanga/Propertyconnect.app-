import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Clock, Percent, AlertCircle } from 'lucide-react';

const MortgageCalculatorPage: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(500000000);
  const [downPayment, setDownPayment] = useState<number>(100000000);
  const [interestRate, setInterestRate] = useState<number>(15);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  const calculateMortgage = () => {
    const principal = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                   (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(monthly);
    setTotalPayment(monthly * numberOfPayments);
    setTotalInterest(monthly * numberOfPayments - principal);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Mortgage Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Price (UGX)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="input pl-10"
                min="0"
                step="1000000"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment (UGX)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="input pl-10"
                min="0"
                step="1000000"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="input pl-10"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (Years)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="input pl-10"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Payment Breakdown</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="text-2xl font-bold text-primary-700">
                    {monthlyPayment.toLocaleString('en-UG', { 
                      style: 'currency', 
                      currency: 'UGX',
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-primary-600" />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Payment</p>
                  <p className="text-xl font-semibold">
                    {totalPayment.toLocaleString('en-UG', { 
                      style: 'currency', 
                      currency: 'UGX',
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-xl font-semibold">
                    {totalInterest.toLocaleString('en-UG', { 
                      style: 'currency', 
                      currency: 'UGX',
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-primary-600 mt-1 mr-2" />
              <div>
                <h3 className="font-medium mb-2">Important Note</h3>
                <p className="text-sm text-gray-600">
                  This calculator provides an estimate only. Actual mortgage payments may vary based on the lender's terms, fees, and your credit score. We recommend consulting with a financial advisor or mortgage specialist for accurate calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mortgage Partners */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Our Mortgage Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Stanbic Bank</h3>
            <p className="text-gray-600 mb-4">
              Offering competitive rates starting from 15% p.a. with flexible payment terms up to 20 years.
            </p>
            <button className="btn-primary w-full">Learn More</button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Housing Finance Bank</h3>
            <p className="text-gray-600 mb-4">
              Specialized mortgage products with rates from 16% p.a. and up to 25 years repayment period.
            </p>
            <button className="btn-primary w-full">Learn More</button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">DFCU Bank</h3>
            <p className="text-gray-600 mb-4">
              Quick approval process with rates from 15.5% p.a. and flexible down payment options.
            </p>
            <button className="btn-primary w-full">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculatorPage;