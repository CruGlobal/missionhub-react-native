/* eslint max-lines-per-function: 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View } from 'react-native';
import { translate } from 'react-i18next';
import i18n from 'i18next';
import PropTypes from 'prop-types';

import {
  Button,
  Text,
  Flex,
  Icon,
  LoadingWheel,
} from '../../../components/common';
import Input from '../../../components/Input';
import {
  keyLoginWithAuthorizationCode,
  keyLogin,
  openKeyURL,
} from '../../../actions/auth/key';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS, MFA_REQUIRED } from '../../../constants';
import { hasNotch, isAndroid } from '../../../utils/common';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
} from '../../../actions/auth/facebook';
import BackButton from '../../BackButton';

import styles from './styles';

@translate('keyLogin')
class SignInScreen extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: '',
    isLoading: false,
    showLogo: true,
  };

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(
      isAndroid ? 'keyboardDidShow' : 'keyboardWillShow',
      this._hideLogo,
    );
    this.keyboardHideListener = Keyboard.addListener(
      isAndroid ? 'keyboardDidHide' : 'keyboardWillHide',
      this._showLogo,
    );
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  _hideLogo = () => {
    this.setState({ showLogo: false });
  };

  _showLogo = () => {
    this.setState({ showLogo: true });
  };

  emailChanged = email => {
    this.setState({ email });
  };

  passwordChanged = password => {
    this.setState({ password });
  };

  handleForgotPassword = async () => {
    const { dispatch, next } = this.props;
    const { code, codeVerifier, redirectUri } = await dispatch(
      openKeyURL('service/selfservice?target=displayForgotPassword'),
    );
    this.setState({ isLoading: true });
    try {
      await dispatch(
        keyLoginWithAuthorizationCode(code, codeVerifier, redirectUri),
      );
      dispatch(next());
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  login = async () => {
    const { dispatch, next } = this.props;
    const { email, password } = this.state;

    this.setState({ errorMessage: '', isLoading: true });

    try {
      await dispatch(keyLogin(email, password));
      Keyboard.dismiss();
      dispatch(next());
    } catch (error) {
      this.setState({ isLoading: false });

      const apiError = error.apiError;
      let errorMessage;
      let action;

      if (
        apiError['error'] === 'invalid_request' ||
        apiError['thekey_authn_error'] === 'invalid_credentials'
      ) {
        errorMessage = i18n.t('keyLogin:invalidCredentialsMessage');
      } else if (apiError['thekey_authn_error'] === 'email_unverified') {
        errorMessage = i18n.t('keyLogin:verifyEmailMessage');
      } else if (apiError['thekey_authn_error'] === MFA_REQUIRED) {
        dispatch(
          next({
            requires2FA: true,
            email,
            password,
          }),
        );
        this.setState({ email: '', password: '' });
        return;
      }

      if (errorMessage) {
        action = ACTIONS.USER_ERROR;
        this.setState({ errorMessage });
      } else {
        action = ACTIONS.SYSTEM_ERROR;
      }

      dispatch(trackActionWithoutData(action));
    }
  };

  facebookLogin = async () => {
    const { dispatch, next } = this.props;

    try {
      await dispatch(facebookPromptLogin());
      this.setState({ isLoading: true });
      await dispatch(facebookLoginWithAccessToken());
      dispatch(next());
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  renderErrorMessage() {
    const { errorMessage } = this.state;

    return errorMessage ? (
      <View style={styles.errorBar}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    ) : null;
  }

  passwordRef = c => (this.password = c);

  focusPassword = () => this.password.focus();

  render() {
    const { t, forcedLogout } = this.props;
    const { showLogo, email, password, isLoading } = this.state;
    const marginTop = hasNotch() ? 50 : 25;

    return (
      <View style={styles.container}>
        {this.renderErrorMessage()}
        {forcedLogout ? (
          <View style={{ marginTop }} />
        ) : (
          <BackButton style={{ marginLeft: 5, marginTop }} />
        )}
        <Flex align="center" justify="center">
          {showLogo ? (
            forcedLogout ? (
              <Text style={styles.forcedLogoutHeader}>
                {t('forcedLogout:message')}
              </Text>
            ) : (
              <Text type="header" style={styles.header}>
                {t('signIn')}
              </Text>
            )
          ) : null}
        </Flex>

        <Flex value={3} style={{ paddingVertical: 10, paddingHorizontal: 30 }}>
          <View>
            <Text style={styles.label}>{t('emailLabel')}</Text>
            <Input
              autoCapitalize="none"
              onChangeText={this.emailChanged}
              value={email}
              keyboardType="email-address"
              onSubmitEditing={this.focusPassword}
              placeholder={t('emailLabel')}
              returnKeyType="next"
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingVertical: 15 }}>
            <Text style={styles.label}>{t('passwordLabel')}</Text>
            <Input
              secureTextEntry={true}
              ref={this.passwordRef}
              onChangeText={this.passwordChanged}
              value={password}
              placeholder={t('passwordLabel')}
              placeholderTextColor="white"
              returnKeyType="done"
              onSubmitEditing={this.login}
            />
            <Button
              name={'forgotPasswordButton'}
              text={t('forgotPassword')}
              type="transparent"
              style={styles.forgotPasswordButton}
              buttonTextStyle={styles.forgotPasswordText}
              onPress={this.handleForgotPassword}
            />
          </View>
        </Flex>

        {email || password ? (
          <Flex align="stretch" justify="end">
            <Button
              name={'loginButton'}
              type="secondary"
              onPress={this.login}
              text={t('login').toUpperCase()}
            />
          </Flex>
        ) : (
          <Flex value={1} justify="center" align="center">
            <Button
              name={'facebookButton'}
              pill={true}
              onPress={this.facebookLogin}
              style={styles.facebookButton}
              buttonTextStyle={styles.buttonText}
            >
              <Flex direction="row">
                <Icon
                  name="facebookIcon"
                  size={21}
                  type="MissionHub"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>
                  {t('facebookLogin').toUpperCase()}
                </Text>
              </Flex>
            </Button>
          </Flex>
        )}
        {isLoading ? <LoadingWheel /> : null}
      </View>
    );
  }
}

SignInScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (_, { navigation }) => {
  const { forcedLogout } = navigation.state.params || {};

  return { forcedLogout };
};

export default connect(mapStateToProps)(SignInScreen);
export const SIGN_IN_SCREEN = 'nav/SIGN_IN_SCREEN';
