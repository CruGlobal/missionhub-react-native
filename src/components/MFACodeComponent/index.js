import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { Flex, Text, Input, Button } from '../../components/common';
import PlatformKeyboardAvoidingView from '../../components/PlatformKeyboardAvoidingView';
import LoadingWheel from '../../components/LoadingWheel';
import BackButton from '../../containers/BackButton';

export default class MFACodeComponent extends Component {
  render() {
    const { t, onSubmit, onChangeText, isLoading, value } = this.props;
    const { backButton, doneButton, doneButtonText, container, mfaHeader, mfaDescription, label } = styles;

    return (
      <PlatformKeyboardAvoidingView>
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

        <Flex justify="center" value={1} style={container}>

          <Text type="header" style={mfaHeader}>{t('mfaLogin:mfaHeader').toLowerCase()}</Text>

          <Text style={mfaDescription}>{t('mfaLogin:mfaDescription')}</Text>

          <View>
            <Text style={label}>{t('mfaLogin:mfaLabel')}</Text>

            <Input
              onChangeText={onChangeText}
              value={value}
              returnKeyType="done"
              placeholder={t('mfaLogin:mfaLabel')}
              placeholderTextColor="white"
              blurOnSubmit={true}
              keyboardType="numeric"
              onSubmitEditing={onSubmit}
              autoFocus={true}
            />
          </View>
        </Flex>

        {isLoading ? <LoadingWheel /> : null }
      </PlatformKeyboardAvoidingView>
    );
  }
}

MFACodeComponent.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};
