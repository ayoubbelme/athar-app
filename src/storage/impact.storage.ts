import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_TASKS_KEY = '@athar/completed_tasks_ledger_v1';
const REDEEMED_TUTORIALS_KEY = '@athar/redeemed_tutorials_ledger_v1';

export interface CompletedTaskRecord {
  applicationId: string;
  volunteerId?: string;
  volunteerEmail?: string;
  projectId: string;
  projectTitle: string;
  hoursAwarded: number;
  scoreAwarded: number;
  completedAt: string;
}

export interface RedeemedTutorialRecord {
  tutorialId: string;
  costScore: number;
  redeemedAt: string;
}

export const impactStorage = {
  getCompletedTasksMap: async (): Promise<
    Record<string, CompletedTaskRecord>
  > => {
    try {
      const raw = await AsyncStorage.getItem(COMPLETED_TASKS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  recordTaskCompletion: async (
    record: CompletedTaskRecord,
  ): Promise<Record<string, CompletedTaskRecord>> => {
    const current = await impactStorage.getCompletedTasksMap();
    const updated = {
      ...current,
      [record.applicationId]: record,
    };
    await AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updated));
    return updated;
  },

  getRedeemedTutorials: async (): Promise<RedeemedTutorialRecord[]> => {
    try {
      const raw = await AsyncStorage.getItem(REDEEMED_TUTORIALS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  recordTutorialRedemption: async (
    tutorialId: string,
    costScore: number,
  ): Promise<void> => {
    const current = await impactStorage.getRedeemedTutorials();
    const updated: RedeemedTutorialRecord[] = [
      ...current,
      {
        tutorialId,
        costScore,
        redeemedAt: new Date().toISOString(),
      },
    ];
    await AsyncStorage.setItem(REDEEMED_TUTORIALS_KEY, JSON.stringify(updated));
  },
};