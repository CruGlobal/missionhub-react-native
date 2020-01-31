/* eslint-disable */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from 'apollo-client';

import { Text, Touchable } from '../common';

import { styles } from './styles';

interface ErrorNoticeProps {
  error?: ApolloError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: (variables?: any) => Promise<any>;
  message: string;
}

export const ErrorNotice = ({ error, refetch, message }: ErrorNoticeProps) => {
  // Disabling rendering until https://jira.cru.org/browse/MHP-3159 is addressed
  return null;

  // const { t } = useTranslation('errorNotice');

  // return error ? (
  //   <Touchable style={styles.errorContainer} onPress={refetch}>
  //     <Text style={styles.white}>{message}</Text>
  //     {error.networkError && (
  //       <Text style={styles.white}>{t('networkError')}</Text>
  //     )}
  //   </Touchable>
  // ) : null;
};
