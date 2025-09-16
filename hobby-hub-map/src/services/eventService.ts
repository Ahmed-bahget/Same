// src/services/eventService.ts
import { apiClient } from './api';
import { UserResponse } from './authService';

export interface EventResponse {
  eventId: string;
  title: string;
  description?: string;
  creatorUserId: string;
  creatorName?: string;
  hobbyId: string;
  hobbyName?: string;
  placeId?: string;
  placeName?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  startTime: string;
  endTime?: string;
  maxParticipants: number;
  currentParticipants: number;
  price?: number;
  imageUrl?: string;
  status: string;
  isPublic: boolean;
  requiresApproval: boolean;
  requirements?: string;
  createdAt: string;
  updatedAt: string;
  isParticipant?: boolean;
  participationStatus?: string;
}

export interface CreateEventRequest {
  hobbyId: string;
  placeId?: string;
  title: string;
  description?: string;
  customLocationName?: string;
  customLocationAddress?: string;
  latitude?: number;
  longitude?: number;
  startDateTime: string;
  endDateTime?: string;
  maxParticipants?: number;
  entryFee?: number;
  requiresApproval?: boolean;
  isPublic?: boolean;
  imageUrls?: string[];
}

export interface UpdateEventRequest extends CreateEventRequest {
  isActive?: boolean;
  status?: string;
}

export interface SearchEventsRequest {
  title?: string;
  hobbyId?: string;
  placeId?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  privacyLevel?: string;
  hasAvailableSlots?: boolean;
  page?: number;
  pageSize?: number;
}

export interface JoinEventRequest {
  eventId: string;
  message?: string;
  payEntryFee?: boolean;
}

class EventService {
  // Event retrieval
  async getUpcomingEvents(page: number = 1, pageSize: number = 20): Promise<EventResponse[]> {
    return await apiClient.get<EventResponse[]>(`/event?page=${page}&pageSize=${pageSize}`);
  }

  async getEventById(eventId: string): Promise<EventResponse> {
    return await apiClient.get<EventResponse>(`/event/${eventId}`);
  }

  async getEventsByHobby(hobbyId: string): Promise<EventResponse[]> {
    return await apiClient.get<EventResponse[]>(`/event/hobby/${hobbyId}`);
  }

  async getEventsByLocation(latitude: number, longitude: number, radiusKm: number = 10): Promise<EventResponse[]> {
    return await apiClient.get<EventResponse[]>(
      `/event/location?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
    );
  }

  async getMyEvents(filter: string = 'all'): Promise<EventResponse[]> {
    return await apiClient.get<EventResponse[]>(`/event/my-events?filter=${filter}`);
  }

  async searchEvents(request: SearchEventsRequest): Promise<EventResponse[]> {
    return await apiClient.post<EventResponse[]>('/event/search', request);
  }

  async getPopularEvents(count: number = 10): Promise<EventResponse[]> {
    return await apiClient.get<EventResponse[]>(`/event/popular?count=${count}`);
  }

  // Event management
  async createEvent(request: CreateEventRequest): Promise<EventResponse> {
    return await apiClient.post<EventResponse>('/event', request);
  }

  async updateEvent(eventId: string, request: UpdateEventRequest): Promise<EventResponse> {
    return await apiClient.put<EventResponse>(`/event/${eventId}`, request);
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    return await apiClient.delete<boolean>(`/event/${eventId}`);
  }

  // Event participation
  async joinEvent(eventId: string, request?: JoinEventRequest): Promise<boolean> {
    return await apiClient.post<boolean>(`/event/${eventId}/join`, request || {});
  }

  async leaveEvent(eventId: string): Promise<boolean> {
    return await apiClient.post<boolean>(`/event/${eventId}/leave`);
  }

  async getEventParticipants(eventId: string): Promise<UserResponse[]> {
    return await apiClient.get<UserResponse[]>(`/event/${eventId}/participants`);
  }

  async inviteToEvent(eventId: string, userIds: string[]): Promise<boolean> {
    return await apiClient.post<boolean>(`/event/${eventId}/invite`, { userIds });
  }

  // Utility methods for formatting
  formatEventDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatEventTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isEventUpcoming(dateString: string): boolean {
    return new Date(dateString) > new Date();
  }

  isEventLive(startString: string, endString?: string): boolean {
    const now = new Date();
    const start = new Date(startString);
    const end = endString ? new Date(endString) : null;
    
    return start <= now && (!end || now <= end);
  }

  getEventStatus(event: EventResponse): 'upcoming' | 'live' | 'ended' | 'cancelled' {
    if (event.status.toLowerCase() === 'cancelled') return 'cancelled';
    
    if (this.isEventLive(event.startTime, event.endTime)) return 'live';
    if (this.isEventUpcoming(event.startTime)) return 'upcoming';
    return 'ended';
  }
}

export const eventService = new EventService();












// import { apiClient } from './api';

// export interface Event {
//   eventId: string;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate?: string;
//   location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
//   maxParticipants?: number;
//   currentParticipants: number;
//   hobbyId: string;
//   hobbyName: string;
//   createdBy: {
//     id: string;
//     username: string;
//     profileImage?: string;
//   };
//   isJoined?: boolean;
//   imageUrl?: string;
//   tags?: string[];
// }

// export interface EventResponse {
//   eventId: string;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate?: string;
//   location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
//   maxParticipants?: number;
//   currentParticipants: number;
//   hobbyId: string;
//   hobbyName: string;
//   createdBy: {
//     id: string;
//     username: string;
//     profileImage?: string;
//   };
//   isJoined?: boolean;
//   imageUrl?: string;
//   tags?: string[];
// }

// export interface CreateEventRequest {
//   title: string;
//   description: string;
//   startDate: string;
//   endDate?: string;
//   location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
//   maxParticipants?: number;
//   hobbyId: string;
//   imageUrl?: string;
//   tags?: string[];
// }

// export interface JoinEventRequest {
//   message?: string;
// }

// class EventService {
//   async getUpcomingEvents(page: number = 1, pageSize: number = 20) {
//     return apiClient.get<EventResponse[]>(`/event?page=${page}&pageSize=${pageSize}`);
//   }

//   async getEventById(eventId: string) {
//     return apiClient.get<EventResponse>(`/event/${eventId}`);
//   }

//   async getEventsByHobby(hobbyId: string) {
//     return apiClient.get<EventResponse[]>(`/event/hobby/${hobbyId}`);
//   }

//   async getEventsByLocation(latitude: number, longitude: number, radiusKm: number = 10) {
//     return apiClient.get<EventResponse[]>(
//       `/event/location?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
//     );
//   }

//   async createEvent(eventData: CreateEventRequest) {
//     return apiClient.post<EventResponse>('/event', eventData);
//   }

//   async joinEvent(eventId: string, joinData?: JoinEventRequest) {
//     return apiClient.post(`/event/${eventId}/join`, joinData);
//   }

//   async leaveEvent(eventId: string) {
//     return apiClient.post(`/event/${eventId}/leave`);
//   }

//   async getMyEvents(filter: 'all' | 'upcoming' | 'past' = 'all') {
//     return apiClient.get<EventResponse[]>(`/event/my-events?filter=${filter}`);
//   }
// }

// export const eventService = new EventService();
