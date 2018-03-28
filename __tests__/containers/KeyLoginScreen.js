import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import KeyLoginScreen from '../../src/containers/KeyLoginScreen';
import { createMockStore, renderShallow, testSnapshot } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';

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
    beforeEach(async() => {
      const credentials = { email: 'klas&jflk@lkjasdf.com', password: 'this&is=unsafe' };
      screen.setState(credentials);
      auth.keyLogin.mockImplementation((email, password) => {
        return email === encodeURIComponent(credentials.email) && password === encodeURIComponent(credentials.password) ? loginResult : undefined;
      });

      await screen.find({ name: 'loginButton' }).simulate('press');
    });

    it('key login is called', async() => {
      expect(store.dispatch).toHaveBeenLastCalledWith(loginResult);
    });
    it('loading wheel appears', () => {
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });

  it('forgot password is called', () => {
    let click = () => screen.find({ name: 'forgotPasswordButton' }).simulate('press');

    click();

    expect(auth.openKeyURL).toHaveBeenCalledWith('service/selfservice?target=displayForgotPassword');
  });
});
