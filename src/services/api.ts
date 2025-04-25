import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Types
export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  createdAt: string
  updatedAt: string
}

// API Functions
const fetchProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

const fetchPropertyById = async (id: string): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// React Query Hooks
export const useProperties = (options?: UseQueryOptions<Property[]>) => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    ...options,
  })
}

export const useProperty = (id: string, options?: UseQueryOptions<Property>) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchPropertyById(id),
    ...options,
  })
}

// Mutations
interface CreatePropertyData {
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
}

const createProperty = async (data: CreatePropertyData): Promise<Property> => {
  const { data: newProperty, error } = await supabase
    .from('properties')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return newProperty
}

export const useCreateProperty = (options?: UseMutationOptions<Property, Error, CreatePropertyData>) => {
  return useMutation({
    mutationFn: createProperty,
    ...options,
  })
} 