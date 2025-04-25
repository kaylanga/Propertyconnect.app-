import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Send } from 'lucide-react';

const WalletPage: React.FC = () => {
  const { balance, deposit, withdraw, transfer, isLoading } = useWallet();
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      switch (activeTab) {
        case 'deposit':
          await deposit(numAmount);
          setSuccess('Deposit successful');
          break;
        case 'withdraw':
          await withdraw(numAmount);
          setSuccess('Withdrawal successful');
          break;
        case 'transfer':
          if (!recipientId) {
            setError('Please enter a recipient ID');
            return;
          }
          await transfer(numAmount, recipientId);
          setSuccess('Transfer successful');
          break;
      }
      setAmount('');
      setRecipientId('');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
        
        <div className="bg-primary-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-600 font-medium">Available Balance</p>
              <p className="text-3xl font-bold text-primary-900">
                {balance.toLocaleString('en-UG', {
                  style: 'currency',
                  currency: 'UGX'
                })}
              </p>
            </div>
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'deposit'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('deposit')}
            >
              Deposit
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'withdraw'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('withdraw')}
            >
              Withdraw
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'transfer'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('transfer')}
            >
              Transfer
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (UGX)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 input"
                placeholder="Enter amount"
                min="0"
              />
            </div>
          </div>

          {activeTab === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient ID
              </label>
              <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                className="input"
                placeholder="Enter recipient's ID"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-2 flex items-center justify-center"
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                {activeTab === 'deposit' && <ArrowDownLeft className="h-5 w-5 mr-2" />}
                {activeTab === 'withdraw' && <ArrowUpRight className="h-5 w-5 mr-2" />}
                {activeTab === 'transfer' && <Send className="h-5 w-5 mr-2" />}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {/* Transaction history will be implemented here */}
          <p className="text-gray-500 text-center py-4">
            Transaction history coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;