import { Availability } from '../types/auth.types';
import {
  ProjectCategory,
  ProjectStatus,
} from '../types/volunteer-home.types';

export const CATEGORY_ARABIC_LABELS: Record<ProjectCategory, string> = {
  EDUCATION: 'التعليم',
  HEALTH: 'الصحة',
  ENVIRONMENT: 'البيئة',
  COMMUNITY: 'المجتمع',
  HUMANITARIAN: 'العمل الإنساني',
  ARTS_CULTURE: 'الفنون والثقافة',
  SPORTS: 'الرياضة',
  TECHNOLOGY: 'التكنولوجيا',
  ANIMAL_WELFARE: 'الرفق بالحيوان',
};

export const ALL_PROJECT_CATEGORIES: ProjectCategory[] = [
  'HEALTH',
  'EDUCATION',
  'ENVIRONMENT',
  'COMMUNITY',
  'HUMANITARIAN',
  'TECHNOLOGY',
  'ARTS_CULTURE',
  'SPORTS',
  'ANIMAL_WELFARE',
];

export const STATUS_ARABIC_LABELS: Record<ProjectStatus, string> = {
  DRAFT: 'مسودة',
  PUBLISHED: 'متاح للتقديم',
  IN_PROGRESS: 'قيد التنفيذ',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغى',
};

export const AVAILABILITY_ARABIC_LABELS: Record<Availability, string> = {
  WEEKDAYS: 'أيام الأسبوع',
  WEEKENDS: 'عطلة نهاية الأسبوع',
  EVENINGS: 'الفترة المسائية',
  FLEXIBLE: 'وقت مرن',
};

export function translateCategory(category: ProjectCategory | null): string {
  if (!category) return 'عام';
  return CATEGORY_ARABIC_LABELS[category] ?? category;
}

export function translateStatus(status: ProjectStatus): string {
  return STATUS_ARABIC_LABELS[status] ?? status;
}

export function translateAvailability(availability: Availability): string {
  return AVAILABILITY_ARABIC_LABELS[availability] ?? availability;
}