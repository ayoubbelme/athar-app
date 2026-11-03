import { RegisterPayload } from '../types/auth.types';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export function validateLoginInput(email: string, password: string): string | null {
  if (!email.trim() || !password) {
    return 'Please enter both your email and password.';
  }
  return null;
}

export function validateRegisterInput(payload: RegisterPayload): string | null {
  const trimmedName = payload.name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return 'Name must be between 2 and 100 characters.';
  }

  if (payload.role === 'ORGANIZATION') {
    const trimmedOrg = payload.organizationName?.trim() ?? '';
    if (!trimmedOrg) {
      return 'Organization name is required for organization accounts.';
    }
    if (trimmedOrg.length > 150) {
      return 'Organization name cannot exceed 150 characters.';
    }
  }

  if (!payload.email.trim().includes('@')) {
    return 'Please enter a valid email address.';
  }

  if (payload.password.length < 8 || payload.password.length > 128) {
    return 'Password must be at least 8 characters long.';
  }

  if (!PASSWORD_REGEX.test(payload.password)) {
    return 'Password must contain at least one letter and one number.';
  }

  return null;
}