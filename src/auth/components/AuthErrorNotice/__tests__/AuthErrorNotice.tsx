import React from 'react';
import { render } from 'react-native-testing-library';
import i18next from 'i18next';

import { AuthErrorNotice } from '../AuthErrorNotice';
import { AuthError } from '../../../constants';

it('should match snapshot', () => {
  const { toJSON } = render(
    <AuthErrorNotice error={AuthError.CredentialsIncorrect} />,
  );

  expect(toJSON()).toMatchSnapshot();
});

it.each([
  ['credentialsIncorrect', AuthError.CredentialsIncorrect],
  ['emailUnverified', AuthError.EmailUnverified],
  ['mfaIncorrect', AuthError.MfaIncorrect],
  ['unknown', AuthError.Unknown],
])('should render %s', (i18nValue, authError) => {
  const { getByText } = render(<AuthErrorNotice error={authError} />);

  expect(() =>
    getByText(i18next.t(`authErrorNotice:${i18nValue}`)),
  ).not.toThrow();
});
