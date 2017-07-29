export class YelpRequest {
  term: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export class YelpResponse {
  total: number;
  businesses: [
    {
      rating: number,
      price: '$' | '$$' | '$$$' | '$$$$',
      phone: string,
      id: string,
      is_closed: boolean,
      categories: [
        {
          alias: string,
          title: string
        }
      ],
      review_count: number,
      name: string,
      url: string,
      coordinates: {
        latitude: number,
        longitude: number
      },
      image_url: string,
      location: {
        city: string,
        country: string,
        address2: string,
        address3: string,
        state: string,
        address1: string,
        zip_code: string
      },
      distance: number,
      transactions: string[]
    }
  ]
  region: {
    center: {
      latitude: number,
      longitude: number
    }
  }
}
