import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Input, Button } from '../../components/common';
import LoadingWheel from '../../components/LoadingWheel';
import BackButton from '../../containers/BackButton';

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
    backButton,
    doneButton,
    doneButtonText,
    container,
    content,
    mfaHeader,
    mfaDescription,
    label,
  } = styles;

  return (
    <SafeAreaView style={container}>
      <Flex direction="row" justify="between" align="center">
        <BackButton style={backButton} />

        <Button
          testID="doneButton"
          text={t('done').toUpperCase()}
          type="transparent"
          onPress={onSubmit}
          style={doneButton}
          buttonTextStyle={doneButtonText}
        />
      </Flex>

      <Flex justify="center" value={1} style={content}>
        <Text type="header" style={mfaHeader}>
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
    </SafeAreaView>
  );
};
