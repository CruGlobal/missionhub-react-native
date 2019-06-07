import React from 'react';
import { Alert } from 'react-native';
import { render, flushMicrotasksQueue } from 'react-native-testing-library';

import App from '../App';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  NETWORK_REQUEST_FAILED,
} from '../constants';
import * as auth from '../actions/auth/auth';
import locale from '../i18n/locales/en-US';
import { rollbar } from '../utils/rollbar.config';

jest.mock('../AppNavigator', () => 'AppNavigator');
jest.mock('react-native-default-preference', () => ({
  get: jest.fn().mockReturnValue(Promise.reject()),
}));
global.window = {};

const logoutResponse = { type: 'logged out' };
auth.logout = jest.fn().mockReturnValue(logoutResponse);

const { youreOffline, connectToInternet } = locale.offline;

const lastTwoArgs = [
  [{ text: 'Ok', onPress: expect.anything() }],
  { onDismiss: expect.anything() },
];

beforeEach(
  () =>
    (Alert.alert = jest
      .fn()
      .mockImplementation((_, __, buttons) => buttons[0].onPress())),
);

const testUnhandledRejection = async response => {
  render(<App />);

  await flushMicrotasksQueue(); // Prevents console errors from PlatformKeyboardAvoidingView doing stuff after test has finished

  window.onunhandledrejection({ reason: response });
};

it('shows offline alert if network request failed', async () => {
  await testUnhandledRejection({
    apiError: { message: NETWORK_REQUEST_FAILED },
  });

  expect(Alert.alert).toHaveBeenCalledWith(
    youreOffline,
    connectToInternet,
    ...lastTwoArgs,
  );
});

it('should not show alert for expired access token', async () => {
  await testUnhandledRejection({
    apiError: { errors: [{ detail: EXPIRED_ACCESS_TOKEN }] },
  });

  expect(Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert for invalid access token', async () => {
  await testUnhandledRejection({
    apiError: { errors: [{ detail: INVALID_ACCESS_TOKEN }] },
  });

  expect(Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert for invalid grant', async () => {
  await testUnhandledRejection({ apiError: { error: INVALID_GRANT } });

  expect(Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert if not ApiError', async () => {
  const message = 'some message\nwith break';

  await testUnhandledRejection({ key: 'test', method: '', message });

  expect(Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert if no error message', async () => {
  const unknownError = { key: 'test', method: '' };

  await testUnhandledRejection(unknownError);

  expect(Alert.alert).not.toHaveBeenCalled();
});

describe('__DEV__ === false', () => {
  let dev;
  beforeAll(() => {
    dev = __DEV__;
    __DEV__ = false;
  });

  afterAll(() => {
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

    await testUnhandledRejection(apiError);

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

    await testUnhandledRejection(error);

    expect(rollbar.error).toHaveBeenCalledWith(error);
  });

  it('Sends Rollbar report for unknown error', async () => {
    const unknownError = { key: 'test', method: '' };

    await testUnhandledRejection(unknownError);

    expect(rollbar.error).toHaveBeenCalledWith(
      Error(`Unknown Error:\n${JSON.stringify(unknownError, null, 2)}`),
    );
  });
});
