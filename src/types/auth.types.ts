// src/types/auth.types.ts

export type Role = 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN';

export type SelfRegistrationRole = 'VOLUNTEER' | 'ORGANIZATION';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED';

export type Availability = 'WEEKDAYS' | 'WEEKENDS' | 'EVENINGS' | 'FLEXIBLE';

/**
 * Mirrors UserResponseDto from the NestJS backend
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  location: string | null;
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Mirrors TokenPairDto from the NestJS backend
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}

/**
 * Mirrors AuthResponseDto returned by /auth/login and /auth/register
 */
export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

/**
 * Mirrors LoginDto for POST /auth/login
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Mirrors RegisterDto for POST /auth/register
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: SelfRegistrationRole;
  organizationName?: string;
  location?: string;
}

/**
 * Mirrors RefreshTokenDto for POST /auth/refresh and POST /auth/logout
 */
export interface RefreshTokenPayload {
  refreshToken: string;
}

/**
 * Mirrors ErrorResponseDto / ErrorResponseBody produced by AllExceptionsFilter
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: string[];
  path: string;
  timestamp: string;
}