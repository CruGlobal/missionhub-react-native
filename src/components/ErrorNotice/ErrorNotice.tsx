import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from 'apollo-client';

import { Text, Touchable, Icon } from '../common';

import { styles } from './styles';

interface ErrorNoticeProps {
  error?: ApolloError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: (variables?: any) => Promise<any>;
  message: string;
  specificErrors?: {
    condition: string;
    message: string;
  }[];
}

export const ErrorNotice = ({
  error,
  refetch,
  message,
  specificErrors = [],
}: ErrorNoticeProps) => {
  const { t } = useTranslation('errorNotice');
  const matchedErrors =
    error &&
    specificErrors.reduce((acc: ReactNode[], specificError) => {
      return error.graphQLErrors
        .map(({ message }) => message)
        .includes(specificError.condition)
        ? [
            ...acc,
            <Text key={message} style={styles.text}>
              {specificError.message}
            </Text>,
          ]
        : acc;
    }, []);

  return error ? (
    // Wrapped refetch in function to avoid passing native event to variables argument
    <Touchable style={styles.errorContainer} onPress={() => refetch()}>
      {error.networkError ? (
        <Text style={styles.text}>{t('offline')}</Text>
      ) : matchedErrors && matchedErrors.length > 0 ? (
        matchedErrors
      ) : (
        <Text style={styles.text}>{message}</Text>
      )}
      <Icon name="refresh" />
    </Touchable>
  ) : null;
};
