import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from 'apollo-client';

import { Text, Touchable, Icon } from '../common';

import { styles } from './styles';

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
      {error.networkError ? (
        <Text style={styles.white}>{t('offline')}</Text>
      ) : (
        <Text style={styles.white}>{message}</Text>
      )}
      <Icon name="refresh" />
    </Touchable>
  ) : null;
};
