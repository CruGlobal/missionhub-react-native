import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';

import { useAuth } from '../../useAuth';
import { IdentityProvider } from '../../constants';
import { SignInWithTheKeyType } from '../../providers/useSignInWithTheKey';
import theme from '../../../theme';

import { SocialAuthButton } from './SocialAuthButton/SocialAuthButton';
import EmailIcon from './emailIcon.svg';
import AppleIcon from './appleIcon.svg';
import GoogleIcon from './googleIcon.svg';
import FacebookIcon from './facebookIcon.svg';
import { styles } from './styles';

export enum SocialAuthButtonsType {
  SignIn,
  SignUp,
}

interface SocialAuthButtonsProps {
  type: SocialAuthButtonsType;
  authenticate: ReturnType<typeof useAuth>['authenticate'];
  testID?: string;
}

export const SocialAuthButtons = ({
  type,
  authenticate,
}: SocialAuthButtonsProps) => {
  const { t } = useTranslation('socialAuthButtons');

  const renderAppleButton = () => (
    <SocialAuthButton
      icon={<AppleIcon />}
      text={
        type === SocialAuthButtonsType.SignIn
          ? t('signInWithApple')
          : t('signUpWithApple')
      }
      onPress={() => authenticate({ provider: IdentityProvider.Apple })}
      backgroundColor="black"
    />
  );

  return (
    <View style={styles.container}>
      {type === SocialAuthButtonsType.SignUp ? (
        <SocialAuthButton
          icon={<EmailIcon />}
          text={t('signUpWithEmail')}
          onPress={() =>
            authenticate({
              provider: IdentityProvider.TheKey,
              theKeyOptions: {
                type: SignInWithTheKeyType.SignUp,
              },
            })
          }
          borderColor={theme.secondaryColor}
        />
      ) : null}
      {appleAuth.isSupported ? renderAppleButton() : null}
      <SocialAuthButton
        icon={<GoogleIcon />}
        text={
          type === SocialAuthButtonsType.SignIn
            ? t('signInWithGoogle')
            : t('signUpWithGoogle')
        }
        onPress={() => authenticate({ provider: IdentityProvider.Google })}
        backgroundColor="white"
        textColor="black"
      />
      <SocialAuthButton
        icon={<FacebookIcon />}
        text={
          type === SocialAuthButtonsType.SignIn
            ? t('signInWithFacebook')
            : t('signUpWithFacebook')
        }
        onPress={() => authenticate({ provider: IdentityProvider.Facebook })}
        backgroundColor="#3B5998"
      />
      {appleAuthAndroid.isSupported ? renderAppleButton() : null}
    </View>
  );
};
