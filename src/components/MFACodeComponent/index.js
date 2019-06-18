import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Flex, Text, Input, Button } from '../../components/common';
import LoadingWheel from '../../components/LoadingWheel';
import BackButton from '../../containers/BackButton';

import styles from './styles';

@withTranslation('mfaLogin')
export default class MFACodeComponent extends Component {
  render() {
    const { t, onSubmit, onChangeText, isLoading, value } = this.props;
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
            text={t('done').toUpperCase()}
            type="transparent"
            onPress={onSubmit}
            style={doneButton}
            buttonTextStyle={doneButtonText}
          />
        </Flex>

        <Flex justify="center" value={1} style={content}>
          <Text header={true} style={mfaHeader}>
            {t('mfaHeader').toLowerCase()}
          </Text>

          <Text style={mfaDescription}>{t('mfaDescription')}</Text>

          <View>
            <Text style={label}>{t('mfaLabel')}</Text>

            <Input
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
  }
}

MFACodeComponent.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
