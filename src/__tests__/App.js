import React from 'react';
import ReactNative from 'react-native';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import { Crashlytics } from 'react-native-fabric';
import StackTrace from 'stacktrace-js';

import App from '../App';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  NETWORK_REQUEST_FAILED,
} from '../constants';
import * as auth from '../actions/auth';
import locale from '../i18n/locales/en-US';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../AppNavigator', () => ({ AppNavigator: 'mockAppNavigator' }));

jest.mock('react-native-default-preference', () => ({
  get: jest.fn().mockReturnValue(Promise.reject()),
}));
global.window = {};

const logoutResponse = { type: 'logged out' };
auth.logout = jest.fn().mockReturnValue(logoutResponse);

jest.mock('react-navigation-redux-helpers', () => ({
  createReactNavigationReduxMiddleware: jest.fn(),
}));

jest.mock('stacktrace-js');

jest.mock('../store', () => ({
  store: require('../../testUtils').createMockStore(),
  persistor: {},
}));

const { youreOffline, connectToInternet } = locale.offline;
const {
  error,
  unexpectedErrorMessage,
  baseErrorMessage,
  ADD_NEW_PERSON,
} = locale.error;

const lastTwoArgs = [
  [{ text: 'Ok', onPress: expect.anything() }],
  { onDismiss: expect.anything() },
];

const stackFrames = [{ id: '1' }, { id: '2' }];
const shiftedStackFrames = [stackFrames[1]];
const stacktraceResponse = Promise.resolve(stackFrames);

beforeEach(() =>
  (ReactNative.Alert.alert = jest
    .fn()
    .mockImplementation((_, __, buttons) => buttons[0].onPress())));

const test = async response => {
  const shallowScreen = shallow(<App />);

  await shallowScreen.instance().handleError(response);

  return shallowScreen;
};

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

it('should show specific error message if request has it', () => {
  test({ apiError: {}, key: 'ADD_NEW_PERSON', method: '', message: '' });

  expect(ReactNative.Alert.alert).toHaveBeenCalledWith(
    error,
    `${ADD_NEW_PERSON} ${baseErrorMessage}`,
    ...lastTwoArgs,
  );
});

it('should show generic error message if request does not have it', () => {
  test({ apiError: {}, key: 'test', method: '', message: '' });

  expect(ReactNative.Alert.alert).toHaveBeenCalledWith(
    error,
    `${unexpectedErrorMessage} ${baseErrorMessage}`,
    ...lastTwoArgs,
  );
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
  let dev;
  beforeAll(() => {
    dev = __DEV__;
    __DEV__ = false;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    StackTrace.fromError.mockReturnValue(stacktraceResponse);
    StackTrace.get.mockReturnValue(stacktraceResponse);
  });

  afterAll(() => {
    __DEV__ = dev;
  });

  it('Sends Crashlytics report for API error', async () => {
    const apiError = {
      apiError: { message: 'Error Text' },
      key: 'ADD_NEW_PERSON',
      method: 'POST',
      endpoint: 'apis/v4/people',
      query: { filters: { organization_ids: '1' } },
    };

    await test(apiError);

    expect(Crashlytics.recordCustomExceptionName).toHaveBeenCalledWith(
      `API Error: ${apiError.key} ${apiError.method.toUpperCase()} ${
        apiError.endpoint
      }`,
      `\n\nQuery Params:\n${JSON.stringify(
        apiError.query,
        null,
        2,
      )}\n\nResponse:\n${JSON.stringify(apiError.apiError, null, 2)}`,
      shiftedStackFrames,
    );
  });

  it('Sends Crashlytics report for error with message', async () => {
    const errorName = 'Error Name';
    const errorDetails = 'Error Details';
    const apiError = { message: `${errorName}\n${errorDetails}` };

    await test(apiError);

    expect(Crashlytics.recordCustomExceptionName).toHaveBeenCalledWith(
      errorName,
      apiError.message,
      stackFrames,
    );
  });

  it('Sends Crashlytics report for unknown error', async () => {
    const unknownError = { key: 'test', method: '' };

    await test(unknownError);

    expect(Crashlytics.recordCustomExceptionName).toHaveBeenCalledWith(
      'Unknown Error',
      JSON.stringify(unknownError),
      shiftedStackFrames,
    );
  });
});
