import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';

import { Button } from '../common';
import { FooterLoading } from '../FooterLoading';

import styles from './styles';

interface RefreshButtonProps {
  refresh: () => void;
  loading: boolean;
}

const RefreshButton = ({ refresh, loading }: RefreshButtonProps) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Button
        testID={'refreshButton'}
        onPress={refresh}
        text={t('refresh')}
        buttonTextStyle={styles.buttonText}
        style={styles.button}
        pill={true}
      >
        {loading ? <FooterLoading /> : null}
      </Button>
    </SafeAreaView>
  );
};

export default RefreshButton;
