import React, { Component } from 'react';
import { View, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text, Input, Button } from '../../components/common';
import { keyLogin } from '../../actions/auth';
import PlatformKeyboardAvoidingView from '../../components/PlatformKeyboardAvoidingView';
import { MFA_REQUIRED } from '../../constants';

@translate('mfaLogin')
class MFACodeScreen extends Component {

  state = {
    mfaCode: '',
  };

  mfaCodeChanged = (mfaCode) => {
    this.setState({ mfaCode });
  };

  completeMfa = async() => {
    const { email, password, upgradeAccount } = this.props;
    const { dispatch, t } = this.props;

    try {
      await dispatch(keyLogin(email, password, this.state.mfaCode, upgradeAccount));
      Keyboard.dismiss();

      //todo need loading indicator

    } catch (error) {
      if (error && error.apiError['thekey_authn_error'] === MFA_REQUIRED) {
        Alert.alert(t('mfaIncorrect'), t('ok'));
        return;
      }

      throw error;
    }
  };

  render() {
    const { t } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        <Flex justify="center" value={1} style={styles.container}>

          <Text type="header" style={styles.mfaHeader}>{t('mfaLogin:mfaHeader').toLowerCase()}</Text>

          <Text style={styles.mfaDescription}>{t('mfaLogin:mfaDescription')}</Text>

          <View>
            <Text style={styles.label}>{t('mfaLogin:mfaLabel')}</Text>

            <Input
              onChangeText={this.mfaCodeChanged}
              value={this.state.mfaCode}
              returnKeyType="done"
              placeholder={t('mfaLogin:mfaLabel')}
              placeholderTextColor="white"
              blurOnSubmit={true}
              keyboardType="numeric"
              onSubmitEditing={this.completeMfa}
            />
          </View>

          <Button
            text={t('done').toUpperCase()}
            type="transparent"
            onPress={this.completeMfa}
            style={styles.signInButton}
            buttonTextStyle={styles.signInBtnText}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

MFACodeScreen.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(MFACodeScreen);
export const MFA_CODE_SCREEN = 'nav/MFA_SCREEN';
