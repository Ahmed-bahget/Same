// src/services/authService.ts
import { apiClient } from './api';

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  roles: string[];
  isEmailVerified: boolean;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isEmailVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  joinedAt: string;
  roles: string[];
  friendsCount: number;
  followersCount: number;
  followingCount: number;
}

class AuthService {
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', request);
    if (response.accessToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  }

  async login(emailOrUsername: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { emailOrUsername, password };
    const response = await apiClient.post<AuthResponse>('/auth/login', request);
    
    if (response.accessToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  }

  async logout(): Promise<boolean> {
    try {
      await apiClient.post<boolean>('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed, but continuing with local logout');
    } finally {
      this.clearTokens();
    }
    return true;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const response = await apiClient.post<string>('/auth/refresh', refreshToken);
    localStorage.setItem('accessToken', response);
    return response;
  }

  async verifyEmail(token: string): Promise<boolean> {
    return await apiClient.get<boolean>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  }

  async forgotPassword(email: string): Promise<boolean> {
    return await apiClient.post<boolean>('/auth/forgot-password', email);
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    return await apiClient.post<boolean>(`/auth/reset-password?token=${encodeURIComponent(token)}`, newPassword);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export const authService = new AuthService();













// import { apiClient } from './api';

// export interface LoginRequest {
//   EmailOrUsername: string;
//   Password: string;
//   RememberMe?: boolean;
// }

// export interface RegisterRequest {
//   Username: string;
//   Email: string;
//   Password: string;
//   FirstName?: string;
//   LastName?: string;
//   PhoneNumber?: string;
//   DateOfBirth?: string;
//   HobbyIds?: string[];
//   Latitude?: number;
//   Longitude?: number;
//   LocationAddress?: string;
//   ProfileImageUrl?: string;
// }

// export interface AuthResponse {
//   Token: string;
//   ExpiresAt: string;
//   User: User;
//   RefreshToken: string;
// }

// export interface User {
//   UserId: string;
//   Username: string;
//   Email: string;
//   FirstName?: string;
//   LastName?: string;
//   FullName: string;
//   ProfileImageUrl?: string;
//   CoverImageUrl?: string;
//   Bio?: string;
//   PhoneNumber?: string;
//   DateOfBirth?: string;
//   Age: number;
//   CurrentLatitude?: number;
//   CurrentLongitude?: number;
//   LocationAddress?: string;
//   LocationPrivacy?: string;
//   LocationUpdatedAt?: string;
//   IsActive: boolean;
//   IsVerified: boolean;
//   JoinDate: string;
//   LastLoginAt?: string;
//   RelationshipStatus?: string;
//   IsFriend?: boolean;
//   Hobbies?: Array<{
//     HobbyId: string;
//     Name: string;
//     Description?: string;
//     Category?: string;
//   }>;
// }

// class AuthService {
//   async login(credentials: { EmailOrUsername: string; Password: string }) {
//     return apiClient.post<AuthResponse>('/auth/login', credentials);
//   }

//   async register(userData: any) {
//     return apiClient.post<AuthResponse>('/auth/register', userData);
//   }

//   async logout() {
//     return apiClient.post('/auth/logout');
//   }

//   async refreshToken(refreshToken: string) {
//     return apiClient.post<{ token: string }>('/auth/refresh', refreshToken);
//   }

//   async getCurrentUser() {
//     return apiClient.get<User>('/user/profile');
//   }

//   async updateProfile(userData: Partial<User>) {
//     return apiClient.put<User>('/user/profile', userData);
//   }

//   async updateLocation(location: { latitude: number; longitude: number; address?: string }) {
//     return apiClient.put('/user/location', location);
//   }

//   async getNearbyUsers(radiusKm: number = 10) {
//     return apiClient.get<User[]>(`/user/nearby?radiusKm=${radiusKm}`);
//   }

//   async searchUsers(searchData: {
//     searchTerm?: string;
//     hobbies?: string[];
//     location?: { latitude: number; longitude: number; radiusKm: number };
//     page?: number;
//     pageSize?: number;
//   }) {
//     return apiClient.post<User[]>('/user/search', searchData);
//   }

//   async sendFriendRequest(targetUserId: string) {
//     return apiClient.post('/user/connect', { targetUserId });
//   }

//   async respondToFriendRequest(connectionId: string, accept: boolean) {
//     return apiClient.post(`/user/connect/${connectionId}/respond`, accept);
//   }

//   async getConnections(type: 'Friend' | 'Follower' = 'Friend') {
//     return apiClient.get(`/user/connections?type=${type}`);
//   }

//   async removeFriend(friendId: string) {
//     return apiClient.delete(`/user/connections/${friendId}`);
//   }

//   // Token management
//   setToken(token: string) {
//     localStorage.setItem('token', token);
//   }

//   getToken() {
//     return localStorage.getItem('token');
//   }

//   removeToken() {
//     localStorage.removeItem('token');
//   }

//   isAuthenticated() {
//     return !!this.getToken();
//   }
// }

// export const authService = new AuthService();
