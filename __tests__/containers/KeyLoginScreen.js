import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import KeyLoginScreen from '../../src/containers/KeyLoginScreen';
import { createMockStore, renderShallow, testSnapshot } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';
import { trackAction } from '../../src/actions/analytics';
import { ACTIONS } from '../../src/constants';

let store;

jest.mock('react-native-device-info');
jest.mock('../../src/actions/auth', () => ({
  facebookLoginAction: jest.fn().mockReturnValue({ type: 'test' }),
  keyLogin: jest.fn().mockReturnValue({ type: 'test' }),
  openKeyURL: jest.fn(),
}));
jest.mock('../../src/actions/navigation');
jest.mock('react-native-fbsdk', () => ({
  LoginManager: ({
    logInWithReadPermissions: jest.fn().mockReturnValue(Promise.resolve({ isCancelled: true })),
  }),
  AccessToken: ({
    getCurrentAccessToken: jest.fn().mockReturnValue(Promise.resolve({ accessToken: '123' })),
  }),
  GraphRequest: jest.fn((param1, param2, cb) => cb(undefined, {})),
  GraphRequestManager: () => ({ addRequest: () => ({ start: jest.fn() }) }),
}));
jest.mock('../../src/actions/analytics', () => ({
  trackAction: jest.fn(),
}));

beforeEach(() => {
  store = createMockStore();
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <KeyLoginScreen />
    </Provider>
  );
});

describe('a login button is clicked', () => {
  let screen;
  const loginResult = { type: 'login result' };

  beforeEach(() => {
    screen = renderShallow(
      <KeyLoginScreen />,
      store
    );
  });

  describe('facebook login button is pressed', () => {
    beforeEach(() => {
      screen.find({ name: 'facebookButton' }).simulate('press');
    });

    it('facebook login is called', () => {
      expect(auth.facebookLoginAction).toHaveBeenCalledTimes(0);
    });
    it('loading wheel appears', () => {
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });


  describe('key login button is pressed', () => {
    const clickLoginButton = () => screen.find({ name: 'loginButton' }).simulate('press');
    const mockTrackActionResult = { type: 'tracked action' };

    beforeEach(() => {
      const credentials = { email: 'klas&jflk@lkjasdf.com', password: 'this&is=unsafe' };
      screen.setState(credentials);
      auth.keyLogin.mockImplementation((email, password) => {
        return email === encodeURIComponent(credentials.email) && password === encodeURIComponent(credentials.password) ? loginResult : undefined;
      });

      trackAction.mockReset();
      trackAction.mockReturnValue(mockTrackActionResult);
    });

    it('key login is called', async() => {
      await clickLoginButton();

      expect(store.dispatch).toHaveBeenLastCalledWith(loginResult);
    });

    it('loading wheel appears', async() => {
      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
    });

    it('shows invalid credentials message and tracks user error when invalid credentials are entered', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { thekey_authn_error: 'invalid_credentials' } }));

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
      expect(store.dispatch).toHaveBeenLastCalledWith(mockTrackActionResult);
    });

    it('shows invalid credentials message and tracks user error when email or password is missing', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { error: 'invalid_request' } }));

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
      expect(store.dispatch).toHaveBeenLastCalledWith(mockTrackActionResult);
    });

    it('shows email verification required message and tracks user error when email has not been verified', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { thekey_authn_error: 'email_unverified' } }));

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.USER_ERROR);
      expect(store.dispatch).toHaveBeenLastCalledWith(mockTrackActionResult);
    });

    it('tracks system error for unexpected error', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { error: 'invalid_grant' } }));

      await clickLoginButton();

      expect(trackAction).toHaveBeenCalledWith(ACTIONS.SYSTEM_ERROR);
      expect(store.dispatch).toHaveBeenLastCalledWith(mockTrackActionResult);
    });
  });

  describe('forgot password button is pressed', () => {
    beforeEach(() => {
      screen.find({ name: 'forgotPasswordButton' }).simulate('press');
    });

    it('forgot password is called', () => {
      expect(auth.openKeyURL).toHaveBeenCalledWith('service/selfservice?target=displayForgotPassword', screen.instance().startLoad);
    });
    it('loading wheel to be rendered', () => {
      screen.instance().startLoad();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });
});
