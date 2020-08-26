import React, { useState, useRef } from 'react';
import { Keyboard, View, Text, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { AnyAction } from 'redux';

import { Button, Flex, LoadingWheel, Input } from '../../../components/common';
import DeprecatedBackButton from '../../DeprecatedBackButton';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import { useKeyboardListeners } from '../../../utils/hooks/useKeyboardListeners';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { RootState } from '../../../reducers';
import {
  SocialAuthButtons,
  SocialAuthButtonsType,
} from '../../../auth/components/SocialAuthButtons/SocialAuthButtons';
import { useAuth } from '../../../auth/useAuth';
import { SignInWithTheKeyType } from '../../../auth/providers/useSignInWithTheKey';
import { AuthErrorNotice } from '../../../auth/components/AuthErrorNotice/AuthErrorNotice';
import { AuthError, IdentityProvider } from '../../../auth/constants';

import styles from './styles';

const SignInScreen = ({
  next,
}: {
  next: (params?: {
    requires2FA: boolean;
    email: string;
    password: string;
  }) => ThunkAction<void, RootState, never, AnyAction>;
}) => {
  useAnalytics('sign in');
  const { t } = useTranslation('keyLogin');
  const dispatch = useDispatch();
  const forcedLogout = useNavigationParam('forcedLogout');
  const { authenticate, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogo, setShowLogo] = useState(true);

  useKeyboardListeners({
    onShow: () => setShowLogo(false),
    onHide: () => setShowLogo(true),
  });

  const handleForgotPassword = async () => {
    try {
      await authenticate({
        provider: IdentityProvider.TheKey,
        theKeyOptions: {
          type: SignInWithTheKeyType.ForgotPassword,
        },
      });
    } catch {}
  };

  const login = async () => {
    Keyboard.dismiss();
    try {
      await authenticate({
        provider: IdentityProvider.TheKey,
        theKeyOptions: {
          type: SignInWithTheKeyType.EmailPassword,
          email,
          password,
        },
      });
      dispatch(next());
    } catch (error) {
      if (error === AuthError.MfaRequired) {
        dispatch(
          next({
            requires2FA: true,
            email,
            password,
          }),
        );
        setPassword('');
      }
    }
  };

  const passwordRef = useRef<TextInput>(null);

  const focusPassword = () =>
    passwordRef.current && passwordRef.current.focus();

  return (
    <View style={styles.container}>
      <AuthErrorNotice error={error} />
      <Header left={forcedLogout ? null : <DeprecatedBackButton />} />
      {showLogo ? (
        <Flex align="center" justify="center">
          {forcedLogout ? (
            <Text style={styles.forcedLogoutHeader}>
              {t('forcedLogout:message')}
            </Text>
          ) : (
            <Text style={styles.header}>{t('signIn')}</Text>
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
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 38,
          }}
        >
          <SocialAuthButtons
            type={SocialAuthButtonsType.SignIn}
            authenticate={async options => {
              await authenticate(options);
              dispatch(next());
            }}
          />
        </SafeAreaView>
      )}
      {loading ? <LoadingWheel /> : null}
    </View>
  );
};

export default SignInScreen;
export const SIGN_IN_SCREEN = 'nav/SIGN_IN_SCREEN';
