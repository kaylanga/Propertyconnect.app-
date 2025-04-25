import { Property } from '../types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Apartment in Kololo',
    description: 'A beautiful modern apartment in the heart of Kololo with stunning city views. This 2-bedroom apartment features a spacious living area, fully equipped kitchen, and a balcony overlooking the city skyline. The apartment is located in a secure building with 24/7 security, backup power, and water supply. It\'s close to shopping malls, restaurants, and other amenities.',
    price: 800000,
    currency: 'UGX',
    location: 'Kololo, Kampala',
    coordinates: {
      lat: 0.3378,
      lng: 32.5889
    },
    type: 'rent',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    features: ['Balcony', 'Security', 'Parking', 'Swimming Pool', 'Gym', 'Furnished'],
    images: [
      'https://images.pexels.com/photos/13081002/pexels-photo-13081002.jpeg',
      'https://images.pexels.com/photos/13081074/pexels-photo-13081074.jpeg',
      'https://images.pexels.com/photos/13081075/pexels-photo-13081075.jpeg'
    ],
    isVerified: true,
    isFeatured: true,
    isNew: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    agent: {
      id: '1',
      name: 'Sarah Namakula',
      phone: '+256783123456',
      email: 'sarah@propertyconnect.com',
      role: 'owner',
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  },
  {
    id: '2',
    title: 'Luxury 4-Bedroom House in Bugolobi',
    description: 'Elegant 4-bedroom house in the quiet neighborhood of Bugolobi. This spacious family home features a large garden, ample parking space, and modern amenities. The house includes a master bedroom with en-suite bathroom, three additional bedrooms, a large kitchen, dining area, and separate maid\'s quarters. It\'s located in a secure compound with easy access to main roads and shopping centers.',
    price: 3500000,
    currency: 'UGX',
    location: 'Bugolobi, Kampala',
    coordinates: {
      lat: 0.3137,
      lng: 32.6042
    },
    type: 'rent',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    features: ['Garden', 'Parking', 'Security', 'Servant Quarters', 'Backup Power'],
    images: [
      'https://images.pexels.com/photos/13081079/pexels-photo-13081079.jpeg',
      'https://images.pexels.com/photos/13081080/pexels-photo-13081080.jpeg',
      'https://images.pexels.com/photos/13081081/pexels-photo-13081081.jpeg'
    ],
    isVerified: true,
    isFeatured: true,
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-11T09:15:00Z',
    agent: {
      id: '2',
      name: 'David Ochieng',
      phone: '+256756789012',
      email: 'david@propertyconnect.com',
      role: 'agent',
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=12'
    }
  },
  {
    id: '3',
    title: 'Commercial Space in Downtown Kampala',
    description: 'Prime commercial space available in the bustling downtown area of Kampala. Perfect for retail or office use, this property offers excellent visibility and foot traffic. The space features an open floor plan, restrooms, storage area, and street parking. It\'s situated in a commercial building with other businesses and has good security measures in place.',
    price: 2500000,
    currency: 'UGX',
    location: 'Downtown, Kampala',
    coordinates: {
      lat: 0.3136,
      lng: 32.5811
    },
    type: 'rent',
    propertyType: 'commercial',
    area: 200,
    rooms: 3,
    features: ['Central Location', 'High Foot Traffic', 'Security', 'Power Backup'],
    images: [
      'https://images.pexels.com/photos/13081082/pexels-photo-13081082.jpeg',
      'https://images.pexels.com/photos/13081083/pexels-photo-13081083.jpeg',
      'https://images.pexels.com/photos/13081084/pexels-photo-13081084.jpeg'
    ],
    isVerified: true,
    createdAt: '2025-01-08T11:20:00Z',
    updatedAt: '2025-01-09T15:45:00Z',
    agent: {
      id: '3',
      name: 'Robert Mukasa',
      phone: '+256701234567',
      email: 'robert@propertyconnect.com',
      role: 'broker',
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=7'
    }
  },
  {
    id: '4',
    title: '1-Acre Land in Entebbe',
    description: 'Beautiful 1-acre plot of land for sale in Entebbe with lake views. This prime piece of land is perfect for residential development, with clean title deed available for inspection. The land is fenced, has good access roads, and utilities (electricity and water) are available nearby. It\'s located in a developing area with potential for value appreciation.',
    price: 150000000,
    currency: 'UGX',
    location: 'Entebbe, Wakiso',
    coordinates: {
      lat: 0.0512,
      lng: 32.4637
    },
    type: 'sale',
    propertyType: 'land',
    area: 4840,
    features: ['Lake View', 'Clean Title', 'Fenced', 'Access Road'],
    images: [
      'https://images.pexels.com/photos/13081085/pexels-photo-13081085.jpeg',
      'https://images.pexels.com/photos/13081086/pexels-photo-13081086.jpeg',
      'https://images.pexels.com/photos/13081087/pexels-photo-13081087.jpeg'
    ],
    isVerified: true,
    isFeatured: true,
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-01-07T10:30:00Z',
    agent: {
      id: '4',
      name: 'Grace Atuhaire',
      phone: '+256772345678',
      email: 'grace@propertyconnect.com',
      role: 'owner',
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=9'
    }
  },
  {
    id: '5',
    title: 'Modern Studio Apartment in Ntinda',
    description: 'Compact and cozy studio apartment in Ntinda, ideal for a single professional or student. The apartment features an open-plan living/sleeping area, kitchenette, and bathroom. It comes fully furnished with essential items and includes utilities in the rent. Located in a secure compound with shared amenities like laundry facilities and parking.',
    price: 450000,
    currency: 'UGX',
    location: 'Ntinda, Kampala',
    coordinates: {
      lat: 0.3483,
      lng: 32.6156
    },
    type: 'rent',
    propertyType: 'apartment',
    bedrooms: 0,
    bathrooms: 1,
    area: 45,
    features: ['Furnished', 'Security', 'Utilities Included', 'Parking'],
    images: [
      'https://images.pexels.com/photos/13081088/pexels-photo-13081088.jpeg',
      'https://images.pexels.com/photos/13081089/pexels-photo-13081089.jpeg',
      'https://images.pexels.com/photos/13081090/pexels-photo-13081090.jpeg'
    ],
    isVerified: true,
    isNew: true,
    createdAt: '2025-01-12T13:40:00Z',
    updatedAt: '2025-01-12T13:40:00Z',
    agent: {
      id: '5',
      name: 'Samuel Onyango',
      phone: '+256712345678',
      email: 'samuel@propertyconnect.com',
      role: 'agent',
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=15'
    }
  }
];