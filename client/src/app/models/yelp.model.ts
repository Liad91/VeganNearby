import { LatLngLiteral } from '@agm/core';

export class YelpBusiness {
  categories: [
    {
      alias: string,
      title: string
    }
  ];
  coordinates: {
    latitude: number,
    longitude: number
  };
  display_phone: string;
  distance: number;
  id: string;
  image_url: string;
  is_closed: boolean;
  location: {
    address1: string,
    address2: string,
    address3: string,
    city: string,
    country: string,
    display_address: string[],
    state: string,
    zip_code: string
  };
  name: string;
  phone: string;
  price: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  review_count: number;
  url: string;
  transactions: string[];
}

export class YelpSearchResponse {
  total: number;
  businesses: YelpBusiness[];
  region: {
    center: {
      latitude: number,
      longitude: number
    }
  };
  error?: string;
}

export class YelpBusinessResponse {
  categories: [
    {
      alias: string,
      title: string
    }
  ];
  coordinates: {
    latitude: number,
    longitude: number
  };
  display_phone: string;
  hours: [
    {
      is_open_now: boolean,
      hours_type: string,
      open: [
        {
          day: number,
          start: string,
          end: string,
          is_overnight: boolean
        }
      ]
    }
  ];
  id: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  location: {
    address1: string,
    address2: string,
    address3: string,
    city: string,
    country: string,
    cross_streets: string,
    display_address: string[],
    state: string,
    zip_code: string
  };
  name: string;
  phone: string;
  photos: string[];
  price: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  review_count: number;
  url: string;
  transactions: string[];
}

export class YelpReviewsResponse {
  total: number;
  reviews: [
    {
      text: string,
      url: string,
      rating: number,
      time_created: string,
      user: {
        name: string,
        image_url: string
      }
    }
  ];
}

export class YelpSearchParams {
  categories: string;
  radius: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  price?: string;
  limit?: number;
  offset?: number;
}
