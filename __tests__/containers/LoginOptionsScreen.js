import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import LoginOptionsScreen from '../../src/containers/LoginOptionsScreen';
import Adapter from 'enzyme-adapter-react-16/build/index';
import Enzyme, { shallow } from 'enzyme/build/index';
import { createMockStore, testSnapshot, createMockNavState } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';

let store;

jest.mock('../../src/actions/auth', () => ({
  facebookLoginAction: jest.fn().mockReturnValue({ type: 'test' }),
  keyLogin: jest.fn().mockReturnValue({ type: 'test' }),
  firstTime: jest.fn(),
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
  Enzyme.configure({ adapter: new Adapter() });
});

it('renders correctly without upgrade', () => {
  testSnapshot(
    <Provider store={store}>
      <LoginOptionsScreen
        navigation={createMockNavState({ })}
      />
    </Provider>
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
    </Provider>
  );
});

describe('a login button is clicked', () => {
  let screen;

  beforeEach(() => {
    screen = shallow(
      <LoginOptionsScreen
        navigation={createMockNavState({
          upgradeAccount: false,
        })}
      />,
      { context: { store: store } }
    );
    screen = screen.dive().dive().dive().instance();
  });


  it('login to be called', async() => {
    screen.login();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('try it now to be called', async() => {
    screen.tryItNow();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('navigate next to be called', async() => {
    screen.navigateToNext();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('open key login to be called', () => {
    screen.emailSignUp();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(auth.openKeyURL).toHaveBeenCalledWith('login?action=signup', false);
  });

  it('facebook login to not be called', async() => {
    screen.facebookLogin();
    expect(auth.facebookLoginAction).toHaveBeenCalledTimes(0);
  });
});
