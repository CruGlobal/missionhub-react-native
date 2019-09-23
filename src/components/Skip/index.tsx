import React from 'react';
import { ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

interface SkipProps {
  onSkip: Function;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const Skip = ({ onSkip, style, textStyle }: SkipProps) => {
  const { t } = useTranslation();
  return (
    <Button
      testID="skipButton"
      type="transparent"
      onPress={onSkip}
      text={t('skip').toUpperCase()}
      style={[styles.skipBtn, style]}
      buttonTextStyle={[styles.skipBtnText, textStyle]}
    />
  );
};

export default Skip;
