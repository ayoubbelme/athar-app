import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { SignUpContainer } from '../containers/auth/SignUpContainer';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<Props> = ({ route }) => {
  return <SignUpContainer initialRole={route.params?.initialRole} />;
};