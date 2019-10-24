/* eslint max-lines-per-function: 0 */

import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, Keyboard, View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import {
  Button,
  Text,
  Flex,
  Icon,
  LoadingWheel,
  Input,
} from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import BackButton from '../../BackButton';
import Header from '../../../components/Header';
import {
  keyLoginWithAuthorizationCode,
  keyLogin,
  openKeyURL,
} from '../../../actions/auth/key';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS, MFA_REQUIRED } from '../../../constants';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
} from '../../../actions/auth/facebook';
import { useKeyboardListeners } from '../../../utils/hooks/useKeyboardListeners';

import styles from './styles';

const SignInScreen = ({
  dispatch,
  next,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  next: (params?: {
    requires2FA: boolean;
    email: string;
    password: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>;
}) => {
  const { t } = useTranslation('keyLogin');
  const forcedLogout = useNavigationParam('forcedLogout');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  useKeyboardListeners(() => setShowLogo(false), () => setShowLogo(true));

  const handleForgotPassword = async () => {
    const { code, codeVerifier, redirectUri } = await dispatch(
      openKeyURL('service/selfservice?target=displayForgotPassword'),
    );
    setIsLoading(true);
    try {
      await dispatch(
        keyLoginWithAuthorizationCode(code, codeVerifier, redirectUri),
      );
      dispatch(next());
    } catch (e) {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      await dispatch(keyLogin(email, password));
      Keyboard.dismiss();
      dispatch(next());
    } catch (error) {
      setIsLoading(false);

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
        setEmail('');
        setPassword('');
        return;
      }

      if (errorMessage) {
        action = ACTIONS.USER_ERROR;
        setErrorMessage(errorMessage);
      } else {
        action = ACTIONS.SYSTEM_ERROR;
      }

      dispatch(trackActionWithoutData(action));
    }
  };

  const facebookLogin = async () => {
    try {
      await dispatch(facebookPromptLogin());
      setIsLoading(true);
      await dispatch(facebookLoginWithAccessToken());
      dispatch(next());
    } catch (error) {
      setIsLoading(false);
    }
  };

  const renderErrorMessage = () => {
    return errorMessage ? (
      <SafeAreaView style={styles.errorBar}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </SafeAreaView>
    ) : null;
  };

  const passwordRef = useRef<TextInput>(null);

  const focusPassword = () =>
    passwordRef.current && passwordRef.current.focus();

  return (
    <View style={styles.container}>
      {renderErrorMessage()}
      <Header left={forcedLogout ? null : <BackButton />} />
      {showLogo ? (
        <Flex align="center" justify="center">
          {forcedLogout ? (
            <Text style={styles.forcedLogoutHeader}>
              {t('forcedLogout:message')}
            </Text>
          ) : (
            <Text header={true} style={styles.header}>
              {t('signIn')}
            </Text>
          )}
        </Flex>
      ) : null}
      <Flex value={3} style={{ paddingVertical: 10, paddingHorizontal: 30 }}>
        <View>
          <Text style={styles.label}>{t('emailLabel')}</Text>
          <Input
            testID="emailInput"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            onSubmitEditing={focusPassword}
            placeholder={t('emailLabel')}
            returnKeyType="next"
            placeholderTextColor="white"
          />
        </View>
        <View style={{ paddingVertical: 15 }}>
          <Text style={styles.label}>{t('passwordLabel')}</Text>
          <Input
            testID="passwordInput"
            ref={passwordRef}
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholder={t('passwordLabel')}
            placeholderTextColor="white"
            returnKeyType="done"
            onSubmitEditing={login}
          />
          <Button
            testID="forgotPasswordButton"
            text={t('forgotPassword')}
            type="transparent"
            style={styles.forgotPasswordButton}
            buttonTextStyle={styles.forgotPasswordText}
            onPress={handleForgotPassword}
          />
        </View>
      </Flex>
      {email || password ? (
        <BottomButton testID="loginButton" onPress={login} text={t('login')} />
      ) : (
        <SafeAreaView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Button
            testID="facebookButton"
            pill={true}
            onPress={facebookLogin}
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
        </SafeAreaView>
      )}
      {isLoading ? <LoadingWheel /> : null}
    </View>
  );
};

export default connect()(SignInScreen);
export const SIGN_IN_SCREEN = 'nav/SIGN_IN_SCREEN';
