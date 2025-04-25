import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: number;
  isLoading: boolean;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  transfer: (amount: number, recipientId: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user?.id) return;

    try {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (!wallet) {
        // Create wallet if it doesn't exist
        await supabase.from('wallets').insert([
          { user_id: user.id, balance: 0 }
        ]);
        setBalance(0);
      } else {
        setBalance(wallet.balance);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = async (amount: number) => {
    if (!user?.id) return;

    try {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user.id)
        .single();

      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: wallet?.id,
          amount,
          type: 'deposit',
          status: 'completed'
        }
      ]);

      await loadWallet();
    } catch (error) {
      console.error('Error depositing funds:', error);
      throw error;
    }
  };

  const withdraw = async (amount: number) => {
    if (!user?.id) return;

    try {
      if (balance < amount) {
        throw new Error('Insufficient funds');
      }

      const { data: wallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user.id)
        .single();

      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: wallet?.id,
          amount,
          type: 'withdrawal',
          status: 'completed'
        }
      ]);

      await loadWallet();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      throw error;
    }
  };

  const transfer = async (amount: number, recipientId: string) => {
    if (!user?.id) return;

    try {
      if (balance < amount) {
        throw new Error('Insufficient funds');
      }

      const { data: recipientWallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', recipientId)
        .single();

      if (!recipientWallet) {
        throw new Error('Recipient wallet not found');
      }

      const { data: senderWallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Create withdrawal transaction
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: senderWallet?.id,
          amount,
          type: 'withdrawal',
          status: 'completed'
        }
      ]);

      // Create deposit transaction for recipient
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: recipientWallet.id,
          amount,
          type: 'deposit',
          status: 'completed'
        }
      ]);

      await loadWallet();
    } catch (error) {
      console.error('Error transferring funds:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      balance,
      isLoading,
      deposit,
      withdraw,
      transfer
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};