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
} from '../../components/common';
import Input from '../../components/Input/index';
import { keyLogin, openKeyURL } from '../../actions/auth';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, MFA_REQUIRED } from '../../constants';
import { hasNotch, isAndroid } from '../../utils/common';
import { onSuccessfulLogin } from '../../actions/login';
import { facebookLoginWithUsernamePassword } from '../../actions/facebook';
import BackButton from '../BackButton';
import { navigatePush } from '../../actions/navigation';
import { MFA_CODE_SCREEN } from '../MFACodeScreen';

import styles from './styles';

@translate('keyLogin')
class KeyLoginScreen extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: '',
    isLoading: false,
    logo: true,
  };

  componentDidMount() {
    if (isAndroid) {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._hideLogo,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._showLogo,
      );
    } else {
      this.keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this._hideLogo,
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this._showLogo,
      );
    }
  }

  componentWillUnmount() {
    if (isAndroid) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    } else {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    }
  }

  _hideLogo = () => {
    this.setState({ logo: false });
  };

  _showLogo = () => {
    this.setState({ logo: true });
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
    this.props.dispatch(
      openKeyURL(
        'service/selfservice?target=displayForgotPassword',
        this.startLoad,
        this.props.upgradeAccount,
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
    } finally {
      this.setState({ isLoading: false });
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
    return (
      <View style={styles.errorBar}>
        <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
      </View>
    );
  }

  emailRef = c => (this.email = c);

  passwordRef = c => (this.password = c);

  onSubmitEditing = () => this.password.focus();

  render() {
    const { t, forcedLogout } = this.props;
    const marginTop = hasNotch() ? 50 : 25;

    return (
      <View style={styles.container}>
        {this.state.errorMessage ? this.renderErrorMessage() : null}
        {forcedLogout ? (
          <View style={{ marginTop }} />
        ) : (
          <BackButton style={{ marginLeft: 5, marginTop }} />
        )}
        <Flex align="center" justify="center">
          {this.state.logo ? (
            this.props.forcedLogout ? (
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
              ref={this.emailRef}
              onChangeText={this.emailChanged}
              value={this.state.email}
              returnKeyType="next"
              keyboardType="email-address"
              blurOnSubmit={false}
              onSubmitEditing={this.onSubmitEditing}
              placeholder={t('emailLabel')}
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingVertical: 15 }}>
            <Text style={styles.label}>{t('passwordLabel')}</Text>
            <Input
              secureTextEntry={true}
              ref={this.passwordRef}
              onChangeText={this.passwordChanged}
              value={this.state.password}
              returnKeyType="next"
              placeholder={t('passwordLabel')}
              placeholderTextColor="white"
              blurOnSubmit={true}
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
        {!this.state.email && !this.state.password ? (
          <Flex value={1} align="stretch" justify="center" align="center">
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
        ) : null}

        {!this.state.email && !this.state.password ? null : (
          <Flex align="stretch" justify="end">
            <Button
              name={'loginButton'}
              type="secondary"
              onPress={this.login}
              text={t('login').toUpperCase()}
            />
          </Flex>
        )}
        {this.state.isLoading ? <LoadingWheel /> : null}
      </View>
    );
  }
}

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(KeyLoginScreen);
export const KEY_LOGIN_SCREEN = 'nav/KEY_LOGIN';
