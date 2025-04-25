import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from '../PropertyCard'

const mockProperty = {
  id: '1',
  title: 'Beautiful House',
  description: 'A lovely family home',
  price: 500000,
  location: 'New York',
  bedrooms: 3,
  bathrooms: 2,
  area: 2000,
  images: ['image1.jpg'],
  createdAt: '2024-01-20T12:00:00Z',
  updatedAt: '2024-01-20T12:00:00Z'
}

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />)

    expect(screen.getByText('Beautiful House')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('$500,000.00')).toBeInTheDocument()
    expect(screen.getByText('3 beds')).toBeInTheDocument()
    expect(screen.getByText('2 baths')).toBeInTheDocument()
    expect(screen.getByText('2000 sqft')).toBeInTheDocument()
  })

  it('calls onView when View Details button is clicked', () => {
    const mockOnView = vi.fn()
    render(<PropertyCard property={mockProperty} onView={mockOnView} />)

    fireEvent.click(screen.getByText('View Details'))
    expect(mockOnView).toHaveBeenCalledWith('1')
  })

  it('uses placeholder image when no images are provided', () => {
    const propertyWithoutImages = { ...mockProperty, images: [] }
    render(<PropertyCard property={propertyWithoutImages} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/placeholder-property.jpg')
  })
}) 