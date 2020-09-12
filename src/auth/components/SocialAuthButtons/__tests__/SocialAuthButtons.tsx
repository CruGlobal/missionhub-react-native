import React from 'react';
import i18next from 'i18next';
import { render, fireEvent } from 'react-native-testing-library';

import { SocialAuthButtons, SocialAuthButtonsType } from '../SocialAuthButtons';
import { IdentityProvider } from '../../../constants';
import { SignInWithTheKeyType } from '../../../providers/useSignInWithTheKey';

jest.mock('@invertase/react-native-apple-authentication', () => ({
  __esModule: true,
  default: { isSupported: true },
}));

const authenticate = jest.fn();

it.each([
  ['sign in type', SocialAuthButtonsType.SignIn],
  ['sign up type', SocialAuthButtonsType.SignUp],
])('should match snapshot for %s', (_, type) => {
  expect(
    render(
      <SocialAuthButtons type={type} authenticate={authenticate} />,
    ).toJSON(),
  ).toMatchSnapshot();
});

it.each([
  ['signUpWithApple', { provider: IdentityProvider.Apple }],
  [
    'signUpWithEmail',
    {
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.SignUp,
      },
    },
  ],
  ['signUpWithGoogle', { provider: IdentityProvider.Google }],
  ['signUpWithFacebook', { provider: IdentityProvider.Facebook }],
])('should call authenticate on %s press', (i18nValue, authenticateOptions) => {
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
});
