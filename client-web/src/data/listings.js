export const listings = [
  {
    id: '1',
    title: 'Sunny Beachfront Apartment',
    location: 'Miami, FL',
    pricePerNight: 220,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80',
    summary: {
      checkIn: 'Aug 12, 2024',
      checkOut: 'Aug 15, 2024',
      guests: '2 adults',
      nights: 3,
    },
  },
  {
    id: '2',
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, CO',
    pricePerNight: 180,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    summary: {
      checkIn: 'Sep 02, 2024',
      checkOut: 'Sep 05, 2024',
      guests: '4 guests',
      nights: 3,
    },
  },
  {
    id: '3',
    title: 'Modern City Loft',
    location: 'New York, NY',
    pricePerNight: 310,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    summary: {
      checkIn: 'Oct 11, 2024',
      checkOut: 'Oct 14, 2024',
      guests: '1 guest',
      nights: 3,
    },
  },
];

export function getListingById(id) {
  return listings.find((listing) => listing.id === id);
}
