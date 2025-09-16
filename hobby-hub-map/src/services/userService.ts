// src/services/userService.ts
import { apiClient } from './api';
import { UserResponse, UpdateProfileRequest } from './authService';

export interface AddFriendRequest {
  targetUserId: string;
  connectionType: 'Friend' | 'Follow';
  message?: string;
}

export interface SearchUsersRequest {
  searchTerm?: string;
  hobbies?: string[];
  location?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  minAge?: number;
  maxAge?: number;
  isOnline?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ConnectionResponse {
  connectionId: string;
  userId: string;
  friendId: string;
  connectionType: string;
  status: string;
  createdAt: string;
  user: UserResponse;
  friend: UserResponse;
}

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
  address: string;
}

export interface UpdateRoleRequest {
  roleType: string;
  description?: string;
  isActive: boolean;
}

export interface UserRoleResponse {
  userRoleId: string;
  userId: string;
  roleType: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

class UserService {
  // Profile management
  async getCurrentUserProfile(): Promise<UserResponse> {
    return await apiClient.get<UserResponse>('/user/profile');
  }

  async getUserById(userId: string): Promise<UserResponse> {
    return await apiClient.get<UserResponse>(`/user/${userId}`);
  }

  async getUserByUsername(username: string): Promise<UserResponse> {
    return await apiClient.get<UserResponse>(`/user/username/${username}`);
  }

  async updateProfile(request: UpdateProfileRequest): Promise<UserResponse> {
    return await apiClient.put<UserResponse>('/user/profile', request);
  }

  // Search and discovery
  async searchUsers(request: SearchUsersRequest): Promise<UserResponse[]> {
    return await apiClient.post<UserResponse[]>('/user/search', request);
  }

  async getNearbyUsers(radiusKm: number = 10): Promise<UserResponse[]> {
    return await apiClient.get<UserResponse[]>(`/user/nearby?radiusKm=${radiusKm}`);
  }

  async getFriendSuggestions(): Promise<UserResponse[]> {
    return await apiClient.get<UserResponse[]>('/user/suggestions');
  }

  async getMutualFriends(targetUserId: string): Promise<UserResponse[]> {
    return await apiClient.get<UserResponse[]>(`/user/${targetUserId}/mutual-friends`);
  }

  // Connection management
  async sendFriendRequest(request: AddFriendRequest): Promise<boolean> {
    return await apiClient.post<boolean>('/user/connect', request);
  }

  async respondToFriendRequest(connectionId: string, accept: boolean): Promise<boolean> {
    return await apiClient.post<boolean>(`/user/connect/${connectionId}/respond`, accept);
  }

  async getConnections(type: string = 'Friend'): Promise<ConnectionResponse[]> {
    return await apiClient.get<ConnectionResponse[]>(`/user/connections?type=${type}`);
  }

  async getPendingRequests(): Promise<ConnectionResponse[]> {
    return await apiClient.get<ConnectionResponse[]>('/user/connections/pending');
  }

  async removeFriend(friendId: string): Promise<boolean> {
    return await apiClient.delete<boolean>(`/user/connections/${friendId}`);
  }

  async blockUser(targetUserId: string): Promise<boolean> {
    return await apiClient.post<boolean>(`/user/block/${targetUserId}`);
  }

  // Location
  async updateLocation(request: UpdateLocationRequest): Promise<boolean> {
    return await apiClient.put<boolean>('/user/location', request);
  }

  // Roles
  async updateRole(request: UpdateRoleRequest): Promise<boolean> {
    return await apiClient.post<boolean>('/user/roles', request);
  }

  async getUserRoles(): Promise<UserRoleResponse[]> {
    return await apiClient.get<UserRoleResponse[]>('/user/roles');
  }

  async toggleRoleStatus(roleType: string, isActive: boolean): Promise<boolean> {
    return await apiClient.raw<boolean>('PUT', `/user/roles/${roleType}/toggle`, isActive)
      .then(response => response.data.data!);
  }

  // Stats
  async getUserStats(): Promise<any> {
    return await apiClient.get<any>('/user/stats');
  }
}

export const userService = new UserService();