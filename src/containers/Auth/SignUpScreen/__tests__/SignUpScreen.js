import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SignUnScreen, { SIGNUP_TYPES } from '..';

import { testSnapshot, renderShallow } from '../../../../../testUtils';
import {
  keyLoginWithAuthorizationCode,
  openKeyURL,
} from '../../../../actions/auth/key';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
} from '../../../../actions/auth/facebook';
import { navigatePush } from '../../../../actions/navigation';

let store;

const nextAction = { type: 'test-next' };
const next = jest.fn(() => nextAction);

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

beforeEach(() => {
  store = configureStore([thunk])();
});

it('renders correctly with logo', () => {
  testSnapshot(
    <Provider store={store}>
      <SignUnScreen next={next} />
    </Provider>,
  );
});

it('renders correctly for Create Community', () => {
  testSnapshot(
    <Provider store={store}>
      <SignUnScreen signUpType={SIGNUP_TYPES.CREATE_COMMUNITY} next={next} />
    </Provider>,
  );
});

describe('a login button is clicked', () => {
  let screen;
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

  beforeEach(() => {
    navigatePush.mockReturnValue(navigateResponse);
    screen = renderShallow(<SignUnScreen next={next} />, store);
  });

  it('login to be called', () => {
    screen.find({ name: 'loginButton' }).simulate('press');

    expect(next).toHaveBeenCalledWith({ signIn: true });
    expect(store.getActions()).toEqual([nextAction]);
  });

  describe('email signup button is pressed', () => {
    beforeEach(() => {
      openKeyURL.mockReturnValue(openKeyResponse);
      keyLoginWithAuthorizationCode.mockReturnValue(
        keyLoginWithAuthorizationCodeResponse,
      );
    });

    it('key sign in button calls handler', () => {
      screen.find({ name: 'emailButton' }).simulate('press');
      expect(openKeyURL).toHaveBeenCalledWith('login?action=signup');
      expect(store.getActions()).toEqual([openKeyResponse]);
      // Can't do further testing here since enzyme doesn't return a promise from simulate(...)
    });
    it('open key login to be called', async () => {
      await screen.instance().emailSignUp();
      expect(openKeyURL).toHaveBeenCalledWith('login?action=signup');
      expect(keyLoginWithAuthorizationCode).toHaveBeenCalledWith(
        code,
        codeVerifier,
        redirectUri,
      );
      expect(store.getActions()).toEqual([
        openKeyResponse,
        keyLoginWithAuthorizationCodeResponse,
        nextAction,
      ]);
    });
    it('loading wheel to be rendered', async () => {
      await screen.instance().emailSignUp();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });

  describe('facebook signup button is pressed', () => {
    beforeEach(() => {
      facebookPromptLogin.mockReturnValue(facebookPromptLoginResponse);
      facebookLoginWithAccessToken.mockReturnValue(
        facebookLoginWithAccessTokenResponse,
      );
    });

    it('facebook button calls handler', () => {
      screen.find({ name: 'facebookButton' }).simulate('press');
      expect(facebookPromptLogin).toHaveBeenCalled();
      // Can't do further testing here since enzyme doesn't return a promise from simulate(...)
    });
    it('facebook login to be called', async () => {
      await screen.instance().facebookLogin();
      expect(facebookPromptLogin).toHaveBeenCalled();
      expect(facebookLoginWithAccessToken).toHaveBeenCalled();
    });
    it('loading wheel to be rendered', async () => {
      await screen.instance().facebookLogin();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });
});
