import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import KeyLoginScreen from '../../src/containers/KeyLoginScreen';
import { createMockNavState, createMockStore, renderShallow, testSnapshot } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';
import { trackAction } from '../../src/actions/analytics';
import { ACTIONS } from '../../src/constants';
import { facebookLoginWithUsernamePassword } from '../../src/actions/facebook';
import { navigatePush } from '../../src/actions/navigation';
import { MFA_CODE_SCREEN } from '../../src/containers/MFACodeScreen';

let store;

jest.mock('react-native-device-info');
jest.mock('../../src/actions/auth', () => ({
  keyLogin: jest.fn().mockReturnValue({ type: 'test' }),
  openKeyURL: jest.fn(),
}));
jest.mock('../../src/actions/facebook');
facebookLoginWithUsernamePassword.mockReturnValue({ type: 'test' });
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
      <KeyLoginScreen
        navigation={createMockNavState({ })}
      />
    </Provider>
  );
});

it('renders correctly for forced logout', () => {
  testSnapshot(
    <Provider store={store}>
      <KeyLoginScreen
        navigation={createMockNavState({ })}
        forcedLogout={true}
      />
    </Provider>
  );
});

describe('a login button is clicked', () => {
  let screen;
  const loginResult = { type: 'login result' };

  beforeEach(() => {
    screen = renderShallow(
      <KeyLoginScreen
        navigation={createMockNavState({ })}
        upgradeAccount={true}
      />,
      store
    );
  });

  describe('facebook login button is pressed', () => {
    beforeEach(() => {
      facebookLoginWithUsernamePassword.mockImplementation((isUpgrade, startLoad, onComplete) => {
        startLoad();
        return onComplete();
      }) ;

      screen.find({ name: 'facebookButton' }).simulate('press');
    });

    it('facebook login is called', () => {
      expect(facebookLoginWithUsernamePassword).toHaveBeenCalledTimes(1);
    });
    it('loading wheel appears', () => {
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });


  describe('key login button is pressed', () => {
    const clickLoginButton = () => screen.find({ name: 'loginButton' }).simulate('press');

    const mockTrackActionResult = { type: 'tracked action' };
    const expectTrackAction = (expected) => {
      expect(trackAction).toHaveBeenCalledWith(expected);
      expect(store.dispatch).toHaveBeenLastCalledWith(mockTrackActionResult);
    };

    const credentials = { email: 'klas&jflk@lkjasdf.com', password: 'this&is=unsafe' };

    beforeEach(() => {

      screen.setState(credentials);
      auth.keyLogin.mockImplementation((email, password) => {
        return email === credentials.email && password === credentials.password ? loginResult : undefined;
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
      expectTrackAction(ACTIONS.USER_ERROR);
    });

    it('shows invalid credentials message and tracks user error when email or password is missing', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { error: 'invalid_request' } }));

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expectTrackAction(ACTIONS.USER_ERROR);
    });

    it('shows email verification required message and tracks user error when email has not been verified', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { thekey_authn_error: 'email_unverified' } }));

      await clickLoginButton();

      screen.update();
      expect(screen).toMatchSnapshot();
      expectTrackAction(ACTIONS.USER_ERROR);
    });

    it('tracks system error for unexpected error', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { error: 'invalid_grant' } }));

      await clickLoginButton();

      expectTrackAction(ACTIONS.SYSTEM_ERROR);
    });

    it('sends user to MFA screen if the mfa_required is returned from the Key', async() => {
      auth.keyLogin.mockReturnValue(Promise.reject({ apiError: { thekey_authn_error: 'mfa_required' } }));

      await clickLoginButton();

      expect(navigatePush).toHaveBeenCalledWith(MFA_CODE_SCREEN, {
        email: credentials.email,
        password: credentials.password,
        upgradeAccount: true,
      });
    });
  });

  describe('forgot password button is pressed', () => {
    beforeEach(() => {
      screen.find({ name: 'forgotPasswordButton' }).simulate('press');
    });

    it('forgot password is called', () => {
      expect(auth.openKeyURL).toHaveBeenCalledWith('service/selfservice?target=displayForgotPassword', screen.instance().startLoad, true);
    });
    it('loading wheel to be rendered', () => {
      screen.instance().startLoad();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });
});
