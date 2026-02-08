import type React from 'react';
import type { TextInputProps, ViewStyle } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
}
