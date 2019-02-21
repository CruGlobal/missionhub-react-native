/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View } from 'react-native';
import { translate } from 'react-i18next';
import i18n from 'i18next';

import {
  Button,
  Text,
  Flex,
  Icon,
  LoadingWheel,
  SafeView,
} from '../../../components/common';
import Input from '../../../components/Input';
import { keyLogin, openKeyURL } from '../../../actions/auth';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS, MFA_REQUIRED } from '../../../constants';
import { isAndroid } from '../../../utils/common';
import { onSuccessfulLogin } from '../../../actions/login';
import { facebookLoginWithUsernamePassword } from '../../../actions/facebook';
import BackButton from '../../BackButton';
import { navigatePush } from '../../../actions/navigation';
import { MFA_CODE_SCREEN } from '../MFACodeScreen';
import Header from '../../Header';

import styles from './styles';

@translate('keyLogin')
class KeyLoginScreen extends Component {
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

  startLoad = () => {
    this.setState({ isLoading: true });
  };

  navigateToNext = () => {
    const { dispatch, next } = this.props;
    dispatch(next());
  };

  handleForgotPassword = () => {
    const { dispatch, upgradeAccount } = this.props;
    dispatch(
      openKeyURL(
        'service/selfservice?target=displayForgotPassword',
        this.startLoad,
        upgradeAccount,
      ),
    );
  };

  login = async () => {
    const { dispatch, upgradeAccount, next } = this.props;
    const { email, password } = this.state;

    this.setState({ errorMessage: '', isLoading: true });

    try {
      await dispatch(
        keyLogin(
          email,
          password,
          null,
          upgradeAccount,
          next ? this.navigateToNext : null,
        ),
      );
      Keyboard.dismiss();
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
          navigatePush(MFA_CODE_SCREEN, {
            email,
            password,
            upgradeAccount,
            next: next ? this.navigateToNext : null,
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

  facebookLogin = () => {
    const { dispatch, upgradeAccount, next } = this.props;

    dispatch(
      facebookLoginWithUsernamePassword(
        upgradeAccount || false,
        this.startLoad,
        () => onSuccessfulLogin(next ? this.navigateToNext : null),
      ),
    ).then(result => {
      if (result) {
        this.setState({ isLoading: true });
      } else {
        this.setState({ isLoading: false });
      }
    });
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

    return (
      <SafeView style={styles.container}>
        {this.renderErrorMessage()}
        <Header left={forcedLogout ? null : <BackButton />} />
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
      </SafeView>
    );
  }
}

const mapStateToProps = (_, { navigation }) => {
  const { upgradeAccount, forcedLogout } = navigation.state.params || {};

  return { upgradeAccount, forcedLogout };
};

export default connect(mapStateToProps)(KeyLoginScreen);
export const KEY_LOGIN_SCREEN = 'nav/KEY_LOGIN';
