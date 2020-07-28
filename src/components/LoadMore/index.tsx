import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent } from 'react-native';

import { Button } from '../common';

import styles from './styles';

interface LoadMoreProps {
  testID?: string;
  onPress: (event: GestureResponderEvent) => void;
  text?: string;
}

export default function LoadMore({ onPress, text }: LoadMoreProps) {
  const { t } = useTranslation('loadMore');
  return (
    <Button
      type="transparent"
      onPress={onPress}
      style={styles.button}
      text={text || t('load').toUpperCase()}
      buttonTextStyle={styles.text}
      testID="Button"
    />
  );
}
