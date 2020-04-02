import React from 'react';
import ReactNative from 'react-native';
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16/build/index';
// @ts-ignore
import { shallow } from 'enzyme/build/index';
// @ts-ignore
import Enzyme from 'enzyme/build/index';

jest.mock('react-native-vector-icons/MaterialIcons', () => ({
  loadFont: jest.fn(),
}));

import App from '../App';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  NETWORK_REQUEST_FAILED,
} from '../constants';
import * as auth from '../actions/auth/auth';
import { resetToInitialRoute } from '../actions/navigationInit';
import { configureNotificationHandler } from '../actions/notifications';
import { setupFirebaseDynamicLinks } from '../actions/deepLink';
import { getFeatureFlags } from '../actions/misc';
import locale from '../i18n/locales/en-US';
import { rollbar } from '../utils/rollbar.config';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../AppNavigator', () => ({ AppNavigator: 'mockAppNavigator' }));
jest.mock('../actions/misc');
jest.mock('../actions/navigationInit');
jest.mock('../actions/notifications');
jest.mock('../actions/deepLink');

jest.mock('react-native-default-preference', () => ({
  get: jest.fn().mockReturnValue(Promise.reject()),
}));
// @ts-ignore
global.window = {};

const logoutResponse = { type: 'logged out' };
// @ts-ignore
auth.logout = jest.fn().mockReturnValue(logoutResponse);

jest.mock('react-navigation-redux-helpers', () => ({
  createReactNavigationReduxMiddleware: jest.fn(),
}));

jest.mock('../store', () => ({
  store: require('../../testUtils').createThunkStore(),
  persistor: {},
}));

const { youreOffline, connectToInternet } = locale.offline;

const lastTwoArgs = [
  [{ text: 'Ok', onPress: expect.anything() }],
  { onDismiss: expect.anything() },
];

const resetToInitialRouteResult = { type: 'reset to initial route' };
const configureNotificationHandlerResult = {
  type: 'configure notification handler',
};
const setupFirebaseDynamicLinksResult = {
  type: 'setup firebase dynamic links',
};

beforeEach(() => {
  (resetToInitialRoute as jest.Mock).mockReturnValue(resetToInitialRouteResult);
  (configureNotificationHandler as jest.Mock).mockReturnValue(
    configureNotificationHandlerResult,
  );
  (setupFirebaseDynamicLinks as jest.Mock).mockReturnValue(
    setupFirebaseDynamicLinksResult,
  );
  ReactNative.Alert.alert = jest
    .fn()
    .mockImplementation((_, __, buttons) => buttons[0].onPress());
});

// @ts-ignore
const test = async response => {
  const shallowScreen = shallow(<App />);

  await shallowScreen.instance().handleError(response);

  return shallowScreen;
};

it('calls actions onBeforeLift', async () => {
  const shallowScreen = shallow(<App />);

  await shallowScreen.instance().onBeforeLift();

  expect(resetToInitialRoute).toHaveBeenCalledWith();
  expect(configureNotificationHandler).toHaveBeenCalledWith();
  expect(setupFirebaseDynamicLinks).toHaveBeenCalledWith();
  expect(getFeatureFlags).toHaveBeenCalledWith();
});

it('shows offline alert if network request failed', () => {
  test({ apiError: { message: NETWORK_REQUEST_FAILED } });

  expect(ReactNative.Alert.alert).toHaveBeenCalledWith(
    youreOffline,
    connectToInternet,
    ...lastTwoArgs,
  );
});

it('should not show alert for expired access token', () => {
  test({ apiError: { errors: [{ detail: EXPIRED_ACCESS_TOKEN }] } });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert for invalid access token', () => {
  test({ apiError: { errors: [{ detail: INVALID_ACCESS_TOKEN }] } });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert for invalid grant', () => {
  test({ apiError: { error: INVALID_GRANT } });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert if not ApiError', () => {
  const message = 'some message\nwith break';

  test({ key: 'test', method: '', message });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert if no error message', () => {
  const unknownError = { key: 'test', method: '' };

  test(unknownError);

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

describe('__DEV__ === false', () => {
  // @ts-ignore
  let dev;
  beforeAll(() => {
    dev = __DEV__;
    // @ts-ignore
    __DEV__ = false;
  });

  afterAll(() => {
    // @ts-ignore
    __DEV__ = dev;
  });

  it('Sends Rollbar report for API error', async () => {
    const apiError = {
      apiError: { message: 'Error Text' },
      key: 'ADD_NEW_PERSON',
      method: 'POST',
      endpoint: 'apis/v4/people',
      query: { filters: { organization_ids: '1' } },
    };

    await test(apiError);

    expect(rollbar.error).toHaveBeenCalledWith(
      Error(
        `API Error: ${apiError.key} ${apiError.method.toUpperCase()} ${
          apiError.endpoint
        }\n\nQuery Params:\n${JSON.stringify(
          apiError.query,
          null,
          2,
        )}\n\nResponse:\n${JSON.stringify(apiError.apiError, null, 2)}`,
      ),
    );
  });

  it('Sends Rollbar report for JS Error', async () => {
    const errorName = 'Error Name';
    const errorDetails = 'Error Details';
    const error = Error(`${errorName}\n${errorDetails}`);

    await test(error);

    expect(rollbar.error).toHaveBeenCalledWith(error);
  });

  it('Sends Rollbar report for unknown error', async () => {
    const unknownError = { key: 'test', method: '' };

    await test(unknownError);

    expect(rollbar.error).toHaveBeenCalledWith(
      Error(`Unknown Error:\n${JSON.stringify(unknownError, null, 2)}`),
    );
  });
});
