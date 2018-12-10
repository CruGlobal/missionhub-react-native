import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import UpgradeAccountScreen, { SIGNUP_TYPES } from '..';

import { KEY_LOGIN_SCREEN } from '../../KeyLoginScreen';
import {
  testSnapshot,
  createMockNavState,
  renderShallow,
} from '../../../../testUtils';
import { openKeyURL } from '../../../actions/auth';
import { facebookLoginWithUsernamePassword } from '../../../actions/facebook';
import { onSuccessfulLogin } from '../../../actions/login';
import { navigatePush } from '../../../actions/navigation';

let store;

jest.mock('../../../actions/auth');
jest.mock('../../../actions/login');
jest.mock('../../../actions/facebook');
jest.mock('../../../actions/navigation');
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
      <UpgradeAccountScreen navigation={createMockNavState({})} />
    </Provider>,
  );
});

it('renders correctly for Create Community', () => {
  testSnapshot(
    <Provider store={store}>
      <UpgradeAccountScreen
        navigation={createMockNavState({
          signupType: SIGNUP_TYPES.CREATE_COMMUNITY,
        })}
      />
    </Provider>,
  );
});

describe('a login button is clicked', () => {
  let screen;
  const navigateResponse = { type: 'navigate push' };
  const openKeyResponse = { type: 'open key' };
  const facebookLoginResponse = { type: 'facebook login' };
  const successfulLoginResponse = { type: 'successful login' };
  const destinationAfterUpgrade = 'some screen';

  beforeEach(() => {
    navigatePush.mockReturnValue(navigateResponse);
    screen = renderShallow(
      <UpgradeAccountScreen
        navigation={createMockNavState({ destinationAfterUpgrade })}
      />,
      store,
    );
  });

  it('login to be called', () => {
    screen.find({ name: 'loginButton' }).simulate('press');

    expect(navigatePush).toHaveBeenCalledWith(KEY_LOGIN_SCREEN, {
      upgradeAccount: true,
      destinationAfterUpgrade,
    });
    expect(store.getActions()).toEqual([navigateResponse]);
  });

  describe('email signup button is pressed', () => {
    beforeEach(() => {
      openKeyURL.mockReturnValue(openKeyResponse);
      screen.find({ name: 'emailButton' }).simulate('press');
    });

    it('open key login to be called', () => {
      expect(openKeyURL).toHaveBeenCalledWith(
        'login?action=signup',
        screen.instance().startLoad,
        true,
        destinationAfterUpgrade,
      );
      expect(store.getActions()).toEqual([openKeyResponse]);
    });
    it('loading wheel to be rendered', () => {
      screen.instance().startLoad();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });

  describe('facebook signup button is pressed', () => {
    beforeEach(async () => {
      facebookLoginWithUsernamePassword.mockReturnValue(facebookLoginResponse);
      onSuccessfulLogin.mockReturnValue(successfulLoginResponse);
      await screen.find({ name: 'facebookButton' }).simulate('press');
    });

    it('facebook login to be called', () => {
      expect(facebookLoginWithUsernamePassword).toHaveBeenCalledWith(
        true,
        screen.instance().startLoad,
        expect.any(Function),
      );
    });
    it('loading wheel to be rendered', () => {
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });
});
