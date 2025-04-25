import { describe, it, expect, vi } from 'vitest';
import { supabase } from '../lib/supabase';

// Mock Supabase client
vi.mock('../lib/supabase', () => {
  return {
    supabase: {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null
        })
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'test-id' },
              error: null
            })
          })
        }),
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'test-id', full_name: 'Test User' },
              error: null
            })
          })
        })
      })
    }
  };
});

describe('Mock Test', () => {
  it('should mock Supabase auth signUp', async () => {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(error).toBeNull();
    expect(data.user.id).toBe('test-user-id');
  });
  
  it('should mock Supabase from insert', async () => {
    const { data, error } = await supabase
      .from('test_table')
      .insert({ name: 'Test' })
      .select()
      .single();
    
    expect(error).toBeNull();
    expect(data.id).toBe('test-id');
  });
  
  it('should mock Supabase from select', async () => {
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .eq('id', 'test-id')
      .single();
    
    expect(error).toBeNull();
    expect(data.full_name).toBe('Test User');
  });
}); 