import 'react-native';
import React from 'react';
import { Linking } from 'react-native';
import { Provider } from 'react-redux';

import LoginOptionsScreen from '..';

import { JOIN_GROUP_SCREEN } from '../../Groups/JoinGroupScreen';
import {
  createMockStore,
  testSnapshot,
  createMockNavState,
  renderShallow,
} from '../../../../testUtils';
import * as auth from '../../../actions/auth';
import { navigatePush } from '../../../actions/navigation';

let store;

jest.mock('../../../actions/auth', () => ({
  facebookLoginAction: jest.fn().mockReturnValue({ type: 'test' }),
  keyLogin: jest.fn().mockReturnValue({ type: 'test' }),
  firstTime: jest.fn(),
  openKeyURL: jest.fn(),
}));
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigate push' }),
}));
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
  store = createMockStore();
});

it('renders correctly without upgrade', () => {
  testSnapshot(
    <Provider store={store}>
      <LoginOptionsScreen navigation={createMockNavState({})} />
    </Provider>,
  );
});

it('renders correctly with upgrade', () => {
  testSnapshot(
    <Provider store={store}>
      <LoginOptionsScreen
        navigation={createMockNavState({
          upgradeAccount: true,
        })}
      />
    </Provider>,
  );
});

describe('a login button is clicked', () => {
  let screen;

  beforeEach(() => {
    screen = renderShallow(
      <LoginOptionsScreen
        navigation={createMockNavState({
          upgradeAccount: false,
        })}
      />,
      store,
    );
  });

  it('login to be called', () => {
    screen.find({ name: 'loginButton' }).simulate('press');
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('try it now to be called', () => {
    screen.find({ name: 'tryItNowButton' }).simulate('press');
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('community code button to be called', () => {
    screen.find({ name: 'communityCodeButton' }).simulate('press');
    expect(navigatePush).toHaveBeenCalledWith(JOIN_GROUP_SCREEN, {});
  });

  it('navigate next to be called', () => {
    screen.instance().navigateToNext();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  describe('email signup button is pressed', () => {
    beforeEach(() => {
      screen.find({ name: 'emailButton' }).simulate('press');
    });

    it('open key login to be called', () => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(auth.openKeyURL).toHaveBeenCalledWith(
        'login?action=signup',
        screen.instance().startLoad,
        false,
      );
    });
    it('loading wheel to be rendered', () => {
      screen.instance().startLoad();
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });

  describe('facebook signup button is pressed', () => {
    beforeEach(() => {
      screen.find({ name: 'facebookButton' }).simulate('press');
    });

    it('facebook login to not be called', () => {
      expect(auth.facebookLoginAction).toHaveBeenCalledTimes(0);
    });
    it('loading wheel to be rendered', () => {
      screen.update();
      expect(screen).toMatchSnapshot();
    });
  });
});

it('should call openTermsLink', () => {
  const instance = renderShallow(
    <LoginOptionsScreen
      navigation={createMockNavState({
        upgradeAccount: false,
      })}
    />,
    store,
  ).instance();
  Linking.openURL = jest.fn();
  instance.openTermsLink();
  expect(Linking.openURL).toHaveBeenCalled();
});
