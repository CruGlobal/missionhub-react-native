import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ApolloError } from 'apollo-client';

import theme from '../theme';

import { Text, Touchable } from './common';

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: theme.red,
    alignItems: 'center',
    padding: 5,
  },
  white: { color: theme.white },
});

interface ErrorNoticeProps {
  error?: ApolloError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: (variables?: any) => Promise<any>;
  message: string;
}

export const ErrorNotice = ({ error, refetch, message }: ErrorNoticeProps) => {
  const { t } = useTranslation('errorNotice');

  return error ? (
    <Touchable style={styles.errorContainer} onPress={refetch}>
      <Text style={styles.white}>{message}</Text>
      {error.networkError && (
        <Text style={styles.white}>{t('networkError')}</Text>
      )}
    </Touchable>
  ) : null;
};
