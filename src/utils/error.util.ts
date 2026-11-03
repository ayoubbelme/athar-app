import axios from 'axios';
import { ApiErrorResponse } from '../types/auth.types';

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    if (data?.details && data.details.length > 0) {
      return data.details[0];
    }
    if (data?.message) {
      return data.message;
    }
    if (error.code === 'ECONNABORTED' || !error.response) {
      return 'Cannot reach ATHAR server. Check your connection or backend port.';
    }
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}