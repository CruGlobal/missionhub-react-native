import React from 'react';
import { SafeAreaView, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

interface AbsoluteSkipProps {
  onSkip: Function;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const AbsoluteSkip = ({ onSkip, style, textStyle }: AbsoluteSkipProps) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.skipWrap}>
      <Button
        testID="SkipButton"
        type="transparent"
        onPress={onSkip}
        text={t('skip').toUpperCase()}
        style={[styles.skipBtn, style]}
        buttonTextStyle={[styles.skipBtnText, textStyle]}
      />
    </SafeAreaView>
  );
};

export default AbsoluteSkip;
