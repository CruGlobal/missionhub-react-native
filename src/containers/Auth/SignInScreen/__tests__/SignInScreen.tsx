/* eslint max-lines: 0 */

import 'react-native';
import React from 'react';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';

import SignInScreen from '..';

import { renderWithContext } from '../../../../../testUtils';
import {
  openKeyURL,
  keyLogin,
  keyLoginWithAuthorizationCode,
} from '../../../../actions/auth/key';
import { trackActionWithoutData } from '../../../../actions/analytics';
import { ACTIONS, MFA_REQUIRED } from '../../../../constants';
import {
  facebookLoginWithAccessToken,
  facebookPromptLogin,
} from '../../../../actions/auth/facebook';

jest.mock('../../../../actions/analytics');
jest.mock('../../../../actions/auth/key');
jest.mock('../../../../actions/auth/facebook', () => ({
  facebookPromptLogin: jest.fn().mockReturnValue({ type: 'test' }),
  facebookLoginWithAccessToken: jest.fn().mockReturnValue({ type: 'test' }),
}));
let keyboardListeners: { [name: string]: () => void };
jest.mock('../../../../utils/hooks/useKeyboardListeners', () => ({
  useKeyboardListeners: (onShow: () => void, onHide: () => void) =>
    (keyboardListeners = { onShow, onHide }),
}));

jest.mock('../../../../components/common', () => ({
  Button: 'Button',
  Text: 'Text',
  Flex: 'Flex',
  Icon: 'Icon',
  LoadingWheel: 'LoadingWheel',
  Input: 'Input',
}));
jest.mock('../../../../containers/BackButton', () => 'BackButton');
jest.mock('../../../../components/Header', () => 'Header');

const next = jest.fn(() => () => {});

const credentials = {
  email: 'klas&jflk@lkjasdf.com',
  password: 'this&is=unsafe',
};
const code = 'test code';
const codeVerifier = 'test codeVerifier';
const redirectUri = 'test redirectUri';
const openKeyResponse = {
  type: 'open key',
  code,
  codeVerifier,
  redirectUri,
};
const keyLoginWithAuthorizationCodeResponse = {
  type: 'test keyLoginWithAuthorizationCode',
};
const loginResult = { type: 'login result' };

(openKeyURL as jest.Mock).mockReturnValue(openKeyResponse);
(keyLoginWithAuthorizationCode as jest.Mock).mockReturnValue(
  keyLoginWithAuthorizationCodeResponse,
);
(keyLogin as jest.Mock).mockReturnValue(loginResult);
(trackActionWithoutData as jest.Mock).mockReturnValue({
  type: 'tracked action',
});

it('renders correctly', () => {
  renderWithContext(SignInScreen, { componentProps: { next } }).snapshot();
});

it('renders correctly for forced logout', () => {
  renderWithContext(SignInScreen, {
    componentProps: { next },
    navParams: { forcedLogout: true },
  }).snapshot();
});

describe('keyboard listeners', () => {
  it('should hide sign in logo when the keyboard is shown', () => {
    const { recordSnapshot, diffSnapshot } = renderWithContext(SignInScreen, {
      componentProps: { next },
    });

    recordSnapshot();

    act(() => keyboardListeners.onShow());

    diffSnapshot();
  });
  it('should show sign in logo when the keyboard is hidden', () => {
    const { recordSnapshot, diffSnapshot } = renderWithContext(SignInScreen, {
      componentProps: { next },
    });

    act(() => keyboardListeners.onShow());

    recordSnapshot();

    act(() => keyboardListeners.onHide());

    diffSnapshot();
  });
});

describe('facebook login button is pressed', () => {
  it('facebook button calls facebook login logic', async () => {
    const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
      SignInScreen,
      { componentProps: { next } },
    );
    recordSnapshot();

    fireEvent.press(getByTestId('facebookButton'));
    await flushMicrotasksQueue();
    diffSnapshot(); // Check if loading wheel is shown

    expect(facebookPromptLogin).toHaveBeenCalledTimes(1);
    expect(facebookLoginWithAccessToken).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('key login button is pressed', () => {
  const performKeyLogin = async () => {
    const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
      SignInScreen,
      { componentProps: { next } },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('emailInput'), credentials.email);
    fireEvent.changeText(getByTestId('passwordInput'), credentials.password);
    fireEvent.press(getByTestId('loginButton'));
    await flushMicrotasksQueue();
    diffSnapshot();
  };

  it('key login is called', async () => {
    await performKeyLogin();

    expect(keyLogin).toHaveBeenCalledWith(
      credentials.email,
      credentials.password,
    );
    expect(next).toHaveBeenCalled();
  });

  it('should fire login actions when inputs are submitted', async () => {
    const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
      SignInScreen,
      { componentProps: { next } },
    );

    fireEvent.changeText(getByTestId('emailInput'), credentials.email);
    fireEvent(getByTestId('emailInput'), 'submitEditing');
    fireEvent.changeText(getByTestId('passwordInput'), credentials.password);
    recordSnapshot();
    fireEvent(getByTestId('passwordInput'), 'submitEditing');
    await flushMicrotasksQueue();
    diffSnapshot(); // Checking if loading indicator is shown

    expect(keyLogin).toHaveBeenCalledWith(
      credentials.email,
      credentials.password,
    );
    expect(next).toHaveBeenCalled();
  });

  it('shows invalid credentials message and tracks user error when invalid credentials are entered', async () => {
    (keyLogin as jest.Mock).mockReturnValue(() =>
      Promise.reject({
        apiError: { thekey_authn_error: 'invalid_credentials' },
      }),
    );

    await performKeyLogin();

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
    expect(next).not.toHaveBeenCalled();
  });

  it('shows invalid credentials message and tracks user error when email or password is missing', async () => {
    (keyLogin as jest.Mock).mockReturnValue(() =>
      Promise.reject({ apiError: { error: 'invalid_request' } }),
    );

    await performKeyLogin();

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
    expect(next).not.toHaveBeenCalled();
  });

  it('shows email verification required message and tracks user error when email has not been verified', async () => {
    (keyLogin as jest.Mock).mockReturnValue(() =>
      Promise.reject({
        apiError: { thekey_authn_error: 'email_unverified' },
      }),
    );

    await performKeyLogin();

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
    expect(next).not.toHaveBeenCalled();
  });

  it('tracks system error for unexpected error', async () => {
    (keyLogin as jest.Mock).mockReturnValue(() =>
      Promise.reject({ apiError: { error: 'invalid_grant' } }),
    );

    await performKeyLogin();

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.SYSTEM_ERROR);
    expect(next).not.toHaveBeenCalled();
  });

  describe('mfa_required is returned from the Key', () => {
    it('should send user to MFA screen and clear credentials', async () => {
      (keyLogin as jest.Mock).mockReturnValue(() =>
        Promise.reject({ apiError: { thekey_authn_error: MFA_REQUIRED } }),
      );

      await performKeyLogin();

      expect(next).toHaveBeenCalledWith({
        requires2FA: true,
        email: credentials.email,
        password: credentials.password,
      });
    });
  });
});

describe('forgot password button is pressed', () => {
  it('should call forgot password logic', async () => {
    const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
      SignInScreen,
      { componentProps: { next } },
    );

    recordSnapshot();
    fireEvent.press(getByTestId('forgotPasswordButton'));
    await flushMicrotasksQueue();
    diffSnapshot();

    expect(openKeyURL).toHaveBeenCalledWith(
      'service/selfservice?target=displayForgotPassword',
    );
    expect(keyLoginWithAuthorizationCode).toHaveBeenCalledWith(
      code,
      codeVerifier,
      redirectUri,
    );
  });
});
