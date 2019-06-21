import 'react-native';
import React from 'react';

import SignUpScreen, { SIGNUP_TYPES } from '..';

import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import {
  keyLoginWithAuthorizationCode,
  openKeyURL,
} from '../../../../actions/auth/key';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
} from '../../../../actions/auth/facebook';
import { navigatePush } from '../../../../actions/navigation';

const next = jest.fn(() => () => {});

jest.mock('../../../../actions/auth/auth');
jest.mock('../../../../actions/auth/facebook');
jest.mock('../../../../actions/auth/key');
jest.mock('../../../../actions/navigation');
jest.mock('react-native-fbsdk', () => ({
  LoginManager: {
    logInWithReadPermissions: jest
      .fn()
      .mockReturnValue(Promise.resolve({ isCancelled: true })),
  },
  AccessToken: {
    getCurrentAccessToken: jest
      .fn()
      .mockReturnValue(Promise.resolve({ accessToken: '123' })),
  },
  GraphRequest: jest.fn((param1, param2, cb) => cb(undefined, {})),
  GraphRequestManager: () => ({ addRequest: () => ({ start: jest.fn() }) }),
}));

jest.mock('../../../../components/common', () => ({
  Text: 'Text',
  Button: 'Button',
  Flex: 'Flex',
  Icon: 'Icon',
  LoadingWheel: 'LoadingWheel',
}));
jest.mock('../../../BackButton', () => 'BackButton');

it('renders correctly with logo', () => {
  renderWithContext(SignUpScreen, { componentProps: { next } }).snapshot();
});

it('renders correctly for Create Community', () => {
  const { recordSnapshot, rerender, diffSnapshot } = renderWithContext(
    SignUpScreen,
    { componentProps: { next } },
  );
  recordSnapshot();
  rerender(
    <SignUpScreen signUpType={SIGNUP_TYPES.CREATE_COMMUNITY} next={next} />,
  );
  diffSnapshot();
});

describe('a login button is clicked', () => {
  const navigateResponse = { type: 'navigate push' };
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
  const facebookPromptLoginResponse = { type: 'facebookPromptLoginResponse' };
  const facebookLoginWithAccessTokenResponse = {
    type: 'facebookLoginWithAccessTokenResponse',
  };

  (navigatePush as jest.Mock).mockReturnValue(navigateResponse);

  it('login to be called', () => {
    const { getByTestId } = renderWithContext(SignUpScreen, {
      componentProps: { next },
    });
    fireEvent.press(getByTestId('loginButton'));

    expect(next).toHaveBeenCalledWith({ signIn: true });
  });

  describe('email signup button is pressed', () => {
    beforeEach(() => {
      (openKeyURL as jest.Mock).mockReturnValue(openKeyResponse);
      (keyLoginWithAuthorizationCode as jest.Mock).mockReturnValue(
        keyLoginWithAuthorizationCodeResponse,
      );
    });

    it('key sign in button fires sign in actions', async () => {
      const {
        recordSnapshot,
        getByTestId,
        store,
        diffSnapshot,
      } = renderWithContext(SignUpScreen, { componentProps: { next } });
      recordSnapshot();

      fireEvent.press(getByTestId('emailButton'));

      expect(openKeyURL).toHaveBeenCalledWith('login?action=signup');
      await flushMicrotasksQueue();
      expect(keyLoginWithAuthorizationCode).toHaveBeenCalledWith(
        code,
        codeVerifier,
        redirectUri,
      );
      expect(store.getActions()).toEqual([
        openKeyResponse,
        keyLoginWithAuthorizationCodeResponse,
      ]);
      diffSnapshot();
    });
  });

  describe('facebook signup button is pressed', () => {
    beforeEach(() => {
      (facebookPromptLogin as jest.Mock).mockReturnValue(
        facebookPromptLoginResponse,
      );
      (facebookLoginWithAccessToken as jest.Mock).mockReturnValue(
        facebookLoginWithAccessTokenResponse,
      );
    });

    it('facebook button fires fb sign in actions', async () => {
      const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
        SignUpScreen,
        { componentProps: { next } },
      );
      fireEvent.press(getByTestId('facebookButton'));

      recordSnapshot();
      expect(facebookPromptLogin).toHaveBeenCalled();
      await flushMicrotasksQueue();
      expect(facebookLoginWithAccessToken).toHaveBeenCalled();
      diffSnapshot();
    });
  });
});
