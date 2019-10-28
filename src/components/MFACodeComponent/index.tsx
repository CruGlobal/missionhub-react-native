import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Input, Button } from '../../components/common';
import LoadingWheel from '../../components/LoadingWheel';
import BackButton from '../../containers/BackButton';
import Header from '../Header';

import styles from './styles';

export const MFACodeComponent = ({
  onSubmit,
  onChangeText,
  isLoading,
  value,
}: {
  onChangeText: (text: string) => void;
  value: string;
  onSubmit: () => void;
  isLoading: boolean;
  testID?: string;
}) => {
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
      <Header
        left={<BackButton />}
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
        <Text header={true} style={mfaHeader}>
          {t('mfaHeader').toLowerCase()}
        </Text>
        <Text style={mfaDescription}>{t('mfaDescription')}</Text>
        <View>
          <Text style={label}>{t('mfaLabel')}</Text>
          <Input
            testID="mfaCodeInput"
            onChangeText={onChangeText}
            value={value}
            returnKeyType="done"
            placeholder={t('mfaLabel')}
            placeholderTextColor="white"
            blurOnSubmit={true}
            keyboardType="numeric"
            onSubmitEditing={onSubmit}
            autoFocus={true}
          />
        </View>
      </Flex>
      {isLoading ? <LoadingWheel /> : null}
    </View>
  );
};
