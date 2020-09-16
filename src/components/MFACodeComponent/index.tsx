import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Flex, Input, Button } from '../../components/common';
import LoadingWheel from '../../components/LoadingWheel';
import DeprecatedBackButton from '../../containers/DeprecatedBackButton';
import Header from '../Header';
import theme from '../../theme';
import { AuthError } from '../../auth/constants';
import { AuthErrorNotice } from '../../auth/components/AuthErrorNotice/AuthErrorNotice';

import styles from './styles';

interface MFACodeComponentProps {
  onChangeText: (text: string) => void;
  value: string;
  onSubmit: () => void;
  loading: boolean;
  error: AuthError;
  testID?: string;
}

export const MFACodeComponent = ({
  onSubmit,
  onChangeText,
  loading,
  error,
  value,
}: MFACodeComponentProps) => {
  const { t } = useTranslation('mfaLogin');

  const {
    doneButtonText,
    container,
    content,
    mfaHeader,
    mfaDescription,
    label,
  } = styles;

  return (
    <View style={container}>
      <AuthErrorNotice error={error} />
      <Header
        left={<DeprecatedBackButton />}
        right={
          <Button
            testID="doneButton"
            text={t('done').toUpperCase()}
            type="transparent"
            onPress={onSubmit}
            buttonTextStyle={doneButtonText}
          />
        }
      />
      <Flex justify="center" value={1} style={content}>
        <Text style={mfaHeader}>{t('mfaHeader').toLowerCase()}</Text>
        <Text style={mfaDescription}>{t('mfaDescription')}</Text>
        <View>
          <Text style={label}>{t('mfaLabel')}</Text>
          <Input
            testID="mfaCodeInput"
            onChangeText={onChangeText}
            value={value}
            returnKeyType="done"
            placeholder={t('mfaLabel')}
            placeholderTextColor={theme.white}
            blurOnSubmit={true}
            keyboardType="numeric"
            onSubmitEditing={onSubmit}
            autoFocus={true}
          />
        </View>
      </Flex>
      {loading ? <LoadingWheel /> : null}
    </View>
  );
};
