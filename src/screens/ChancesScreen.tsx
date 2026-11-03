// src/screens/ChancesScreen.tsx
import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';
import { ChancesContainer } from '../containers/chances/ChancesContainer'; // 👈 تأكد من وجود الأقواس {}

type Props = BottomTabScreenProps<MainTabParamList, 'ChancesTab'>;

export const ChancesScreen: React.FC<Props> = ({ route }) => {
  return <ChancesContainer initialCategory={route.params?.initialCategory} />;
};