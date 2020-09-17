import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useTranslation } from 'react-i18next';

import { AuthError } from '../../constants';

import { styles } from './styles';

interface AuthErrorNoticeProps {
  error: AuthError;
}

export const AuthErrorNotice = ({ error }: AuthErrorNoticeProps) => {
  const { t } = useTranslation('authErrorNotice');

  const renderMessage = useCallback(() => {
    switch (error) {
      case AuthError.CredentialsIncorrect:
        return t('credentialsIncorrect');
      case AuthError.EmailUnverified:
        return t('emailUnverified');
      case AuthError.MfaIncorrect:
        return t('mfaIncorrect');
      case AuthError.Unknown:
      default:
        return t('unknown');
    }
  }, [error]);

  return error !== AuthError.None && error !== AuthError.MfaRequired ? (
    <SafeAreaView style={styles.errorBar}>
      <Text style={styles.errorMessage}>{renderMessage()}</Text>
    </SafeAreaView>
  ) : null;
};
