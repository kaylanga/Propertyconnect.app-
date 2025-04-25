import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { RealtimeClient } from '@supabase/realtime-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
);

// Initialize realtime client for presence
export const realtime = new RealtimeClient(supabaseUrl, {
  params: {
    apikey: supabaseAnonKey,
  },
});

// Track online status
export const trackPresence = async (userId: string) => {
  const presenceRef = realtime.channel('online-users');
  
  await presenceRef.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceRef.track({
        user_id: userId,
        online_at: new Date().toISOString(),
      });
    }
  });

  return () => {
    presenceRef.unsubscribe();
  };
};

// Listen for presence changes
export const onPresenceChange = (callback: (presence: Record<string, any>, status: 'sync' | 'join' | 'leave') => void) => {
  const presenceRef = realtime.channel('online-users');
  
  presenceRef.on('presence', { event: 'sync' }, () => {
    const state = presenceRef.presenceState();
    callback(state, 'sync');
  });

  return () => {
    presenceRef.unsubscribe();
  };
};

// Subscribe to real-time messages
export const subscribeToMessages = (
  userId: string, 
  callback: (payload: RealtimePostgresChangesPayload<{
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
  }>) => void
) => {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

// Subscribe to property updates
export const subscribeToProperties = (callback: (update: any) => void) => {
  return supabase
    .channel('properties')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'properties',
      },
      callback
    )
    .subscribe();
};

// Subscribe to verification requests
export const subscribeToVerifications = (callback: (update: any) => void) => {
  return supabase
    .channel('verification_requests')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'verification_requests',
      },
      callback
    )
    .subscribe();
};

export type VerificationRequest = {
  id: string;
  user_id: string;
  user_type: string;
  full_name: string;
  phone_number: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  owner_id: string;
  status: 'available' | 'sold' | 'pending';
  created_at: string;
  updated_at: string;
};

export const propertyService = {
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUserProperties(userId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const verificationService = {
  async createVerificationRequest(request: Omit<VerificationRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('verification_requests')
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVerificationRequest(userId: string) {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  getByStatus: async (status: 'pending' | 'approved' | 'rejected') => {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('status', status);
    if (error) throw error;
    return data;
  }
};