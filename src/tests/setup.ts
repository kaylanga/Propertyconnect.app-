import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-user-id' } }, 
        error: null 
      }),
      signInWithPassword: vi.fn().mockImplementation(({ email }) => {
        if (email === 'nonexistent@example.com') {
          return Promise.resolve({ data: { user: null }, error: { message: 'Invalid login credentials' } })
        }
        return Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null })
      }),
    },
    from: vi.fn().mockImplementation((table: string) => {
      const mockData: Record<string, any> = {
        user_profiles: {
          id: 'test-user-id',
          full_name: 'Test User',
          user_type: 'seeker'
        },
        verification_requests: {
          id: 'test-verification-id',
          user_id: 'test-user-id',
          user_type: 'landlord',
          full_name: 'Test Landlord',
          phone_number: '+1234567890'
        },
        properties: {
          id: 'test-property-id',
          title: 'Test Property',
          description: 'Test Description',
          price: 1000,
          location: 'Test Location',
          property_type: 'apartment',
          bedrooms: 2,
          bathrooms: 1,
          size_sqft: 1000
        },
        system_logs: [{
          id: 'test-log-id',
          level: 'info',
          message: 'Test log entry',
          metadata: { test: true },
          created_at: new Date().toISOString()
        }]
      }

      return {
        insert: vi.fn().mockImplementation((data) => {
          if (table === 'user_profiles') {
            return { error: null }
          }
          return {
            select: vi.fn().mockResolvedValue({ data: [mockData[table]], error: null }),
          }
        }),
        select: vi.fn().mockImplementation((columns) => {
          if (table === 'health_check') {
            return {
              single: vi.fn().mockResolvedValue({ data: { count: 1 }, error: null }),
            }
          }
          if (table === 'system_logs') {
            return {
              data: mockData[table],
              error: null
            }
          }
          return {
            single: vi.fn().mockResolvedValue({ data: mockData[table], error: null }),
            eq: vi.fn().mockReturnThis(),
          }
        }),
        eq: vi.fn().mockReturnThis(),
      }
    }),
  },
}))

// Mock LoggingService
vi.mock('@/services/LoggingService', () => ({
  LoggingService: {
    log: vi.fn().mockResolvedValue(undefined),
    getSystemLogs: vi.fn().mockResolvedValue([{
      id: 'test-log-id',
      level: 'info',
      message: 'Test log entry',
      metadata: { test: true },
      created_at: new Date().toISOString()
    }])
  }
}))

// Mock MonitoringService
vi.mock('@/services/MonitoringService', () => ({
  MonitoringService: {
    getSystemHealth: vi.fn().mockResolvedValue({
      database: { status: 'healthy', responseTime: 100 },
      storage: { status: 'healthy', responseTime: 100 },
      api: { status: 'healthy', responseTime: 100 }
    }),
    trackUserActivity: vi.fn().mockResolvedValue(undefined),
    trackAPIMetrics: vi.fn().mockResolvedValue(undefined)
  }
}))

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
}) 