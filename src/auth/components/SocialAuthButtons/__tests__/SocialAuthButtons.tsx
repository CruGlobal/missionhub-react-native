import React from 'react';
import i18next from 'i18next';
import { render, fireEvent } from 'react-native-testing-library';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';

import { SocialAuthButtons, SocialAuthButtonsType } from '../SocialAuthButtons';
import { IdentityProvider } from '../../../constants';
import { SignInWithTheKeyType } from '../../../providers/useSignInWithTheKey';

jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: { isSupported: false },
  appleAuthAndroid: { isSupported: false },
}));

const authenticate = jest.fn();

it.each([
  ['sign in type', null, SocialAuthButtonsType.SignIn],
  ['sign in type', 'ios', SocialAuthButtonsType.SignIn],
  ['sign in type', 'android', SocialAuthButtonsType.SignIn],
  ['sign up type', null, SocialAuthButtonsType.SignUp],
])(
  'should match snapshot for %s when platform is %s',
  (_, supportedDevice, type) => {
    appleAuth.isSupported = supportedDevice === 'ios';
    appleAuthAndroid.isSupported = supportedDevice === 'android';

    expect(
      render(
        <SocialAuthButtons type={type} authenticate={authenticate} />,
      ).toJSON(),
    ).toMatchSnapshot();
  },
);

it.each([
  ['signUpWithApple', 'ios', { provider: IdentityProvider.Apple }],
  ['signUpWithApple', 'android', { provider: IdentityProvider.Apple }],
  [
    'signUpWithEmail',
    null,
    {
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.SignUp,
      },
    },
  ],
  ['signUpWithGoogle', null, { provider: IdentityProvider.Google }],
  ['signUpWithFacebook', null, { provider: IdentityProvider.Facebook }],
])(
  'should call authenticate on %s press when platform is %s',
  (i18nValue, supportedDevice, authenticateOptions) => {
    appleAuth.isSupported = supportedDevice === 'ios';
    appleAuthAndroid.isSupported = supportedDevice === 'android';
    jest.useFakeTimers();

    const { getByText } = render(
      <SocialAuthButtons
        type={SocialAuthButtonsType.SignUp}
        authenticate={authenticate}
      />,
    );

    fireEvent.press(getByText(i18next.t(`socialAuthButtons:${i18nValue}`)));

    jest.runAllTimers();

    expect(authenticate).toHaveBeenCalledWith(authenticateOptions);
  },
);
