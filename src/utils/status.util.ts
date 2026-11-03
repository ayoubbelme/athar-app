import { ApplicationStatus } from '../types/volunteer-home.types';

export const APPLICATION_STATUS_ARABIC: Record<ApplicationStatus, string> = {
  PENDING: 'قيد المراجعة',
  ACCEPTED: 'تم القبول',
  COMPLETED: 'مكتمل (تم إنجاز المهمة)',
  REJECTED: 'مرفوض',
  WITHDRAWN: 'ملغى من طرفك',
};

export function translateApplicationStatus(status: ApplicationStatus): string {
  return APPLICATION_STATUS_ARABIC[status] ?? status;
}