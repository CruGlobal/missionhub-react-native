import React from 'react';
import {
  ViewStyle,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

interface SkipProps {
  onSkip: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  disabled?: boolean;
}

const Skip = ({ onSkip, style, textStyle, disabled }: SkipProps) => {
  const { t } = useTranslation();
  return (
    <Button
      testID="skipButton"
      type="transparent"
      disabled={disabled}
      onPress={onSkip}
      text={t('skip').toUpperCase()}
      style={[styles.skipBtn, style]}
      buttonTextStyle={[styles.skipBtnText, textStyle]}
    />
  );
};

export default Skip;
