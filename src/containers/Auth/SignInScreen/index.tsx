/* eslint-disable max-lines */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux-legacy';
import { SafeAreaView, Keyboard, View, TextInput, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { AnyAction } from 'redux';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import { authorize } from 'react-native-app-auth';

import {
  Button,
  Text,
  Flex,
  Icon,
  LoadingWheel,
  Input,
} from '../../../components/common';
import DeprecatedBackButton from '../../DeprecatedBackButton';
import BottomButton from '../../../components/BottomButton';
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
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { RootState } from '../../../reducers';

import styles from './styles';
import callApi from '../../../actions/api';
import { REQUESTS } from '../../../api/routes';

const SignInScreen = ({
  dispatch,
  next,
}: {
  dispatch: ThunkDispatch<RootState, never, AnyAction>;
  next: (params?: {
    requires2FA: boolean;
    email: string;
    password: string;
  }) => ThunkAction<void, RootState, never, AnyAction>;
}) => {
  useAnalytics('sign in');
  const { t } = useTranslation('keyLogin');
  const forcedLogout = useNavigationParam('forcedLogout');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  useKeyboardListeners({
    onShow: () => setShowLogo(false),
    onHide: () => setShowLogo(true),
  });

  const handleForgotPassword = async () => {
    // @ts-ignore
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
      // @ts-ignore
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

  const onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      // Haven't tested this. I don't have an iPhone and the iOS simulator throws an error before this. https://github.com/invertase/react-native-apple-authentication#troubleshouting I think this endpoint needs an app secret though.
      dispatch(
        callApi(REQUESTS.OKTA_TOKEN, {
          code: appleAuthRequestResponse.authorizationCode,
          grant_type: 'authorization_code',
          redirect_uri: 'com.missionhub:/callback',
          scope: 'openid',
          idp: '0oaptrvvfA7E6EeNR4x6',
        }),
      );
      // Not sure if/how to tell the token endpoint it's an apple authoriztionCode or specify ?idp=0oaptrvvfA7E6EeNR4x6&
      debugger;
    }
  };

  const appleWebPopupLogin = async () => {
    const config = {
      issuer: 'https://dev1-signon.okta.com',
      clientId: '0oapul85kU9w9Dw5R4x6',
      redirectUrl: 'com.missionhub:/callback',
      scopes: ['openid'],
      additionalParameters: { idp: '0oaptrvvfA7E6EeNR4x6' },
    };

    try {
      const result = await authorize(config);
      const response = await dispatch(
        callApi(REQUESTS.OKTA_LOGIN, {
          okta_access_token: result.accessToken,
        }),
      );
      debugger;
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      console.log(error);
    }
  };
  const appleWebLinkLogin = async () => {
    const url =
      'https://dev1-signon.okta.com/oauth2/v1/authorize?idp=0oaptrvvfA7E6EeNR4x6&client_id=0oapul85kU9w9Dw5R4x6&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=com.missionhub:/callback&state=anyvalue&nonce=anyvalue';

    const result = await Linking.openURL(url);
    Linking.addEventListener('url', (...args) => {
      console.log(args);
      debugger;
    });
  };

  useEffect(() => {
    (async () => {
      const url = await Linking.getInitialURL('url');
      console.log(url);
    })();
  }, []);

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
      <Header left={forcedLogout ? null : <DeprecatedBackButton />} />
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
      <Flex value={2} style={{ paddingVertical: 10, paddingHorizontal: 30 }}>
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
        <Flex align="stretch" justify="end">
          <BottomButton
            testID="loginButton"
            onPress={login}
            text={t('login')}
          />
        </Flex>
      ) : (
        <SafeAreaView
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Button
            testID="facebookButton"
            pill={true}
            onPress={facebookLogin}
            style={[styles.socialButton, styles.facebookButton]}
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
          <Button
            testID="applePopupWebButton"
            pill={true}
            onPress={appleWebPopupLogin}
            style={[styles.socialButton, styles.facebookButton]}
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
                {t('appleLoginPopup').toUpperCase()}
              </Text>
            </Flex>
          </Button>
          <Button
            testID="appleLinkWebButton"
            pill={true}
            onPress={appleWebLinkLogin}
            style={[styles.socialButton, styles.facebookButton]}
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
                {t('appleLinkLogin').toUpperCase()}
              </Text>
            </Flex>
          </Button>
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={styles.socialButton}
            onPress={() => onAppleButtonPress()}
          />
        </SafeAreaView>
      )}
      {isLoading ? <LoadingWheel /> : null}
    </View>
  );
};

export default connect()(SignInScreen);
export const SIGN_IN_SCREEN = 'nav/SIGN_IN_SCREEN';
