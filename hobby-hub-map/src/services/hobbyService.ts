// src/services/hobbyService.ts
import { apiClient } from './api';
import { UserResponse } from './authService';
import { EventResponse } from './eventService';

export interface HobbyResponse {
  hobbyId: string;
  name: string;
  description?: string;
  type: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  memberCount?: number;
  eventCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHobbyRequest {
  name: string;
  description?: string;
  type: string;
  category?: string;
  imageUrl?: string;
}

export interface UpdateHobbyRequest extends CreateHobbyRequest {
  isActive?: boolean;
}

export interface JoinHobbyRequest {
  skillLevel?: string;
  yearsExperience?: number;
  personalDescription?: string;
}

export interface UserHobbyResponse {
  userHobbyId: string;
  userId: string;
  hobbyId: string;
  skillLevel: string;
  yearsExperience: number;
  personalDescription?: string;
  joinedAt: string;
  hobby: HobbyResponse;
}

class HobbyService {
  // Hobby retrieval
  async getAllHobbies(): Promise<HobbyResponse[]> {
    return await apiClient.get<HobbyResponse[]>('/hobby');
  }

  async getHobbyById(hobbyId: string): Promise<HobbyResponse> {
    return await apiClient.get<HobbyResponse>(`/hobby/${hobbyId}`);
  }

  async getHobbiesByType(type: string): Promise<HobbyResponse[]> {
    return await apiClient.get<HobbyResponse[]>(`/hobby/type/${type}`);
  }

  async searchHobbies(searchTerm: string): Promise<HobbyResponse[]> {
    return await apiClient.get<HobbyResponse[]>(`/hobby/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  }

  async getPopularHobbies(count: number = 10): Promise<HobbyResponse[]> {
    return await apiClient.get<HobbyResponse[]>(`/hobby/popular?count=${count}`);
  }

  // Hobby management
  async createHobby(request: CreateHobbyRequest): Promise<HobbyResponse> {
    return await apiClient.post<HobbyResponse>('/hobby', request);
  }

  async updateHobby(hobbyId: string, request: UpdateHobbyRequest): Promise<HobbyResponse> {
    return await apiClient.put<HobbyResponse>(`/hobby/${hobbyId}`, request);
  }

  async deleteHobby(hobbyId: string): Promise<boolean> {
    return await apiClient.delete<boolean>(`/hobby/${hobbyId}`);
  }

  // Hobby community
  async getHobbyMembers(hobbyId: string): Promise<UserResponse[]> {
    return await apiClient.get<UserResponse[]>(`/hobby/${hobbyId}/members`);
  }

  async getHobbyEvents(hobbyId: string): Promise<EventResponse[]> {
    return await apiClient.get<EventResponse[]>(`/hobby/${hobbyId}/events`);
  }

  async getUsersByHobby(hobbyId: string): Promise<UserResponse[]> {
    return await apiClient.get<UserResponse[]>(`/hobby/${hobbyId}/users`);
  }

  // User hobby management
  async joinHobby(hobbyId: string, request?: JoinHobbyRequest): Promise<boolean> {
    return await apiClient.post<boolean>(`/hobby/${hobbyId}/join`, request || {});
  }

  async leaveHobby(hobbyId: string): Promise<boolean> {
    return await apiClient.delete<boolean>(`/hobby/${hobbyId}/leave`);
  }

  async getUserHobbies(userId?: string): Promise<UserHobbyResponse[]> {
    const endpoint = userId ? `/user/${userId}/hobbies` : '/user/hobbies';
    return await apiClient.get<UserHobbyResponse[]>(endpoint);
  }

  async updateUserHobby(hobbyId: string, skillLevel: string, yearsExperience: number): Promise<boolean> {
    return await apiClient.put<boolean>(`/user/hobbies/${hobbyId}`, {
      skillLevel,
      yearsExperience
    });
  }

  // Utility methods
  getHobbyTypes(): string[] {
    return [
      'Sports',
      'Arts',
      'Music',
      'Technology',
      'Cooking',
      'Reading',
      'Gaming',
      'Fitness',
      'Photography',
      'Travel',
      'Nature',
      'Crafts',
      'Learning',
      'Social',
      'Other'
    ];
  }

  getSkillLevels(): string[] {
    return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  }

  formatMemberCount(count: number): string {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }

  getHobbyIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'Sports': '⚽',
      'Arts': '🎨',
      'Music': '🎵',
      'Technology': '💻',
      'Cooking': '🍳',
      'Reading': '📚',
      'Gaming': '🎮',
      'Fitness': '💪',
      'Photography': '📸',
      'Travel': '✈️',
      'Nature': '🌲',
      'Crafts': '🧵',
      'Learning': '🎓',
      'Social': '👥',
      'Other': '🔖'
    };
    return iconMap[type] || '🔖';
  }
}

export const hobbyService = new HobbyService();














// import { apiClient } from './api';

// export interface Hobby {
//   hobbyId: string;
//   name: string;
//   description: string;
//   type: string;
//   imageUrl?: string;
//   memberCount: number;
//   isJoined?: boolean;
// }

// export interface HobbyResponse {
//   hobbyId: string;
//   name: string;
//   description: string;
//   type: string;
//   imageUrl?: string;
//   memberCount: number;
//   isJoined?: boolean;
// }

// export interface CreateHobbyRequest {
//   name: string;
//   description: string;
//   type: string;
//   imageUrl?: string;
// }

// export interface UpdateHobbyRequest {
//   name?: string;
//   description?: string;
//   type?: string;
//   imageUrl?: string;
// }

// export interface JoinHobbyRequest {
//   skillLevel?: string;
//   yearsExperience?: number;
//   personalDescription?: string;
// }

// class HobbyService {
//   async getAllHobbies() {
//     return apiClient.get<HobbyResponse[]>('/hobby');
//   }

//   async getHobbyById(hobbyId: string) {
//     return apiClient.get<HobbyResponse>(`/hobby/${hobbyId}`);
//   }

//   async getHobbiesByType(type: string) {
//     return apiClient.get<HobbyResponse[]>(`/hobby/type/${type}`);
//   }

//   async searchHobbies(searchTerm: string) {
//     return apiClient.get<HobbyResponse[]>(`/hobby/search?searchTerm=${encodeURIComponent(searchTerm)}`);
//   }

//   async getPopularHobbies(count: number = 10) {
//     return apiClient.get<HobbyResponse[]>(`/hobby/popular?count=${count}`);
//   }

//   async createHobby(hobbyData: CreateHobbyRequest) {
//     return apiClient.post<HobbyResponse>('/hobby', hobbyData);
//   }

//   async updateHobby(hobbyId: string, hobbyData: UpdateHobbyRequest) {
//     return apiClient.put<HobbyResponse>(`/hobby/${hobbyId}`, hobbyData);
//   }

//   async deleteHobby(hobbyId: string) {
//     return apiClient.delete(`/hobby/${hobbyId}`);
//   }

//   async getHobbyMembers(hobbyId: string) {
//     return apiClient.get(`/hobby/${hobbyId}/members`);
//   }

//   async getHobbyEvents(hobbyId: string) {
//     return apiClient.get(`/hobby/${hobbyId}/events`);
//   }

//   async joinHobby(hobbyId: string, joinData?: JoinHobbyRequest) {
//     return apiClient.post(`/hobby/${hobbyId}/join`, joinData);
//   }

//   async leaveHobby(hobbyId: string) {
//     return apiClient.delete(`/hobby/${hobbyId}/leave`);
//   }

//   async getUsersByHobby(hobbyId: string) {
//     return apiClient.get(`/hobby/${hobbyId}/users`);
//   }
// }

// export const hobbyService = new HobbyService();
