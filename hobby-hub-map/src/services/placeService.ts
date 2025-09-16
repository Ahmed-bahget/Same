import { apiClient } from './api';

export interface Place {
  placeId: string;
  name: string;
  description: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  isForSale?: boolean;
  isForRent?: boolean;
  price?: number;
  createdBy: {
    id: string;
    username: string;
    profileImage?: string;
  };
  tags?: string[];
}

export interface PlaceResponse {
  placeId: string;
  name: string;
  description: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  isForSale?: boolean;
  isForRent?: boolean;
  price?: number;
  createdBy: {
    id: string;
    username: string;
    profileImage?: string;
  };
  tags?: string[];
}

export interface SearchPlacesRequest {
  name?: string;
  type?: string;
  isForSale?: boolean;
  isForRent?: boolean;
  minPrice?: number;
  maxPrice?: number;
  location?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  page?: number;
  pageSize?: number;
}

export interface CreatePlaceRequest {
  name: string;
  description: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  imageUrl?: string;
  isForSale?: boolean;
  isForRent?: boolean;
  price?: number;
  tags?: string[];
}

export interface UpdatePlaceRequest {
  name?: string;
  description?: string;
  type?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  imageUrl?: string;
  isForSale?: boolean;
  isForRent?: boolean;
  price?: number;
  tags?: string[];
}

class PlaceService {
  async getAllPlaces(page: number = 1, pageSize: number = 20) {
    return apiClient.get<PlaceResponse[]>(`/place?page=${page}&pageSize=${pageSize}`);
  }

  async getPlaceById(placeId: string) {
    return apiClient.get<PlaceResponse>(`/place/${placeId}`);
  }

  async searchPlacesByLocation(latitude: number, longitude: number, radiusKm: number = 10) {
    return apiClient.get<PlaceResponse[]>(
      `/place/search/location?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
    );
  }

  async searchPlaces(searchTerm: string, page: number = 1, pageSize: number = 20) {
    return apiClient.get<PlaceResponse[]>(
      `/place/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`
    );
  }

  async getPlacesByType(placeType: string) {
    return apiClient.get<PlaceResponse[]>(`/place/type/${placeType}`);
  }

  async getPlacesForSale(minPrice?: number, maxPrice?: number) {
    const params = new URLSearchParams();
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    
    return apiClient.get<PlaceResponse[]>(`/place/for-sale?${params.toString()}`);
  }

  async getPlacesForRent(minPrice?: number, maxPrice?: number) {
    const params = new URLSearchParams();
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    
    return apiClient.get<PlaceResponse[]>(`/place/for-rent?${params.toString()}`);
  }

  async getPopularPlaces(count: number = 10) {
    return apiClient.get<PlaceResponse[]>(`/place/popular?count=${count}`);
  }

  async createPlace(placeData: CreatePlaceRequest) {
    return apiClient.post<PlaceResponse>('/place', placeData);
  }

  async updatePlace(placeId: string, placeData: UpdatePlaceRequest) {
    return apiClient.put<PlaceResponse>(`/place/${placeId}`, placeData);
  }

  async deletePlace(placeId: string) {
    return apiClient.delete(`/place/${placeId}`);
  }

  async getMyPlaces() {
    return apiClient.get<PlaceResponse[]>('/place/my-places');
  }
}

export const placeService = new PlaceService();
