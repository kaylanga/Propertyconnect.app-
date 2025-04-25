import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase, subscribeToMessages } from '../lib/supabase';
import { useOnlineStatus } from './OnlineStatusContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
  read_at?: string;
}

interface MessagingContextType {
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  unreadCount: number;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isUserOnline } = useOnlineStatus();
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (data) {
        setMessages(data);
        setUnreadCount(
          data.filter(
            (m) => m.receiver_id === user.id && m.status === 'sent'
          ).length
        );
      }
    };

    loadMessages();

    // Subscribe to new messages
    const subscription = subscribeToMessages(user.id, (payload) => {
      const newMessage = payload.new as Message;
      setMessages((prev) => [newMessage, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Show notification
      if (newMessage.receiver_id === user.id) {
        toast.custom((t) => (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <p className="font-medium">New Message</p>
            <p className="text-sm text-gray-600">{newMessage.content}</p>
          </div>
        ));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return;

    const message = {
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      status: isUserOnline(receiverId) ? 'delivered' : 'sent',
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setMessages((prev) => [data, ...prev]);
    }
  };

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({
        status: 'read',
        read_at: new Date().toISOString(),
      })
      .eq('id', messageId);

    if (error) throw error;
    
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, status: 'read', read_at: new Date().toISOString() }
          : m
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <MessagingContext.Provider value={{ messages, sendMessage, markAsRead, unreadCount }}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};