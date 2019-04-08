/* eslint max-lines: 0 */

import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import SignInScreen from '..';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  createMockNavState,
  renderShallow,
  testSnapshot,
} from '../../../../../testUtils';
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

const store = configureStore([thunk])();

jest.mock('react-native-device-info');
jest.mock('../../../../actions/auth/auth');
jest.mock('../../../../actions/auth/facebook');
facebookPromptLogin.mockReturnValue({ type: 'test' });
facebookLoginWithAccessToken.mockReturnValue({ type: 'test' });
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
jest.mock('../../../../actions/analytics');

const nextAction = { type: 'test-next' };
const next = jest.fn(() => nextAction);

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

openKeyURL.mockReturnValue(openKeyResponse);
keyLoginWithAuthorizationCode.mockReturnValue(
  keyLoginWithAuthorizationCodeResponse,
);

beforeEach(() => {
  store.clearActions();
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SignInScreen navigation={createMockNavState({})} next={next} />
    </Provider>,
  );
});

it('renders correctly for forced logout', () => {
  testSnapshot(
    <Provider store={store}>
      <SignInScreen
        navigation={createMockNavState({ forcedLogout: true })}
        next={next}
      />
    </Provider>,
  );
});

describe('keyboard listeners', () => {
  it('should hide sign in logo when the keyboard comes up', () => {
    const component = renderShallow(
      <SignInScreen navigation={createMockNavState({})} next={next} />,
    );

    component.instance().keyboardShowListener.listener();

    component.update();
    expect(component).toMatchSnapshot();
  });

  it('should remove the listeners on unmount', () => {
    const instance = renderShallow(
      <SignInScreen navigation={createMockNavState({})} next={next} />,
    ).instance();
    instance.keyboardShowListener.remove = jest.fn();
    instance.keyboardHideListener.remove = jest.fn();

    instance.componentWillUnmount();

    expect(instance.keyboardShowListener.remove).toHaveBeenCalled();
    expect(instance.keyboardHideListener.remove).toHaveBeenCalled();
  });
});

describe('a login button is clicked', () => {
  let screen;
  const loginResult = { type: 'login result' };

  beforeEach(() => {
    screen = renderShallow(
      <SignInScreen
        navigation={createMockNavState({ upgradeAccount: true })}
        next={next}
      />,
      store,
    );
  });

  describe('facebook login button is pressed', () => {
    it('facebook button handler is called', async () => {
      await screen.find({ name: 'facebookButton' }).simulate('press'); // NOTE: await here is a hack. simulate doesn't return a promise but await lets us win the race condition by waiting a tick
      expect(facebookPromptLogin).toHaveBeenCalledTimes(1);
      expect(facebookLoginWithAccessToken).toHaveBeenCalledTimes(1);
    });
    it('facebook login is called', async () => {
      await screen.instance().facebookLogin();
      expect(facebookPromptLogin).toHaveBeenCalledTimes(1);
      expect(facebookLoginWithAccessToken).toHaveBeenCalledTimes(1);
    });
    it('loading wheel appears', async () => {
      await screen.instance().facebookLogin();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });

  describe('key login button is pressed', () => {
    const clickLoginButton = () =>
      screen.find({ name: 'loginButton' }).simulate('press');

    const mockTrackActionResult = { type: 'tracked action' };

    const credentials = {
      email: 'klas&jflk@lkjasdf.com',
      password: 'this&is=unsafe',
    };

    beforeEach(() => {
      screen.setState(credentials);
      keyLogin.mockReturnValue(loginResult);

      trackActionWithoutData.mockReturnValue(mockTrackActionResult);
    });

    it('key login is called', async () => {
      await clickLoginButton();

      expect(keyLogin).toHaveBeenCalledWith(
        credentials.email,
        credentials.password,
      );
      expect(store.getActions()).toEqual([loginResult, nextAction]);
    });

    it('loading wheel appears', () => {
      clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
    });

    it('shows invalid credentials message and tracks user error when invalid credentials are entered', async () => {
      keyLogin.mockReturnValue(() =>
        Promise.reject({
          apiError: { thekey_authn_error: 'invalid_credentials' },
        }),
      );

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
      expect(store.getActions()).toEqual([nextAction, mockTrackActionResult]);
    });

    it('shows invalid credentials message and tracks user error when email or password is missing', async () => {
      keyLogin.mockReturnValue(() =>
        Promise.reject({ apiError: { error: 'invalid_request' } }),
      );

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
      expect(store.getActions()).toEqual([mockTrackActionResult]);
    });

    it('shows email verification required message and tracks user error when email has not been verified', async () => {
      keyLogin.mockReturnValue(() =>
        Promise.reject({
          apiError: { thekey_authn_error: 'email_unverified' },
        }),
      );

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
      expect(store.getActions()).toEqual([mockTrackActionResult]);
    });

    it('tracks system error for unexpected error', async () => {
      keyLogin.mockReturnValue(() =>
        Promise.reject({ apiError: { error: 'invalid_grant' } }),
      );

      await clickLoginButton();

      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.SYSTEM_ERROR);
      expect(store.getActions()).toEqual([mockTrackActionResult]);
    });

    describe('mfa_required is returned from the Key', () => {
      beforeEach(() =>
        keyLogin.mockReturnValue(() =>
          Promise.reject({ apiError: { thekey_authn_error: MFA_REQUIRED } }),
        ));

      it('should send user to MFA screen', async () => {
        await clickLoginButton();

        expect(next).toHaveBeenCalledWith({
          requires2FA: true,
          email: credentials.email,
          password: credentials.password,
        });
      });

      it('should clear username and password', async () => {
        await clickLoginButton();

        screen.update();
        expect(screen).toMatchSnapshot();
      });
    });
  });

  describe('forgot password button is pressed', () => {
    it('forgot password button handler is called', () => {
      screen.find({ name: 'forgotPasswordButton' }).simulate('press');
      expect(openKeyURL).toHaveBeenCalledWith(
        'service/selfservice?target=displayForgotPassword',
      );
      // Can't do further testing here since enzyme doesn't return a promise from simulate(...)
    });
    it('forgot password is called', async () => {
      await screen.instance().handleForgotPassword();
      expect(openKeyURL).toHaveBeenCalledWith(
        'service/selfservice?target=displayForgotPassword',
      );
      expect(keyLoginWithAuthorizationCode).toHaveBeenCalledWith(
        code,
        codeVerifier,
        redirectUri,
      );
    });
    it('loading wheel to be rendered', async () => {
      await screen.instance().handleForgotPassword();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });
  describe('focusPassword', () => {
    it('should focus the password input', () => {
      const instance = screen.instance();
      instance.password = { focus: jest.fn() };
      instance.focusPassword();

      expect(instance.password.focus).toHaveBeenCalled();
    });
  });
});
