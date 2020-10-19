import React from 'react';
import ReactNative from 'react-native';
import { fireEvent } from 'react-native-testing-library';

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
import { renderWithContext } from '../../testUtils';

jest.mock('react-native-vector-icons/MaterialIcons', () => ({
  loadFont: jest.fn(),
}));
jest.mock('../AppNavigator', () => 'AppWithNavigationState');
jest.mock('../actions/misc');
jest.mock('../actions/navigationInit');
jest.mock('../actions/notifications');
jest.mock('../actions/deepLink');

jest.spyOn(auth, 'logout').mockReturnValue(() => Promise.resolve());

jest.mock('react-navigation-redux-helpers', () => ({
  createReactNavigationReduxMiddleware: jest.fn(),
}));

jest.mock('../store', () => ({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  store: require('../../testUtils').createThunkStore(),

  persistor: { subscribe: jest.fn(), getState: jest.fn().mockReturnValue({}) },
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

const testApp = (response: Parameters<typeof App.prototype.handleError>[0]) => {
  renderWithContext(<App />);

  window.onunhandledrejection?.({ reason: response } as PromiseRejectionEvent);
};

it('calls actions onBeforeLift', async () => {
  const { getByTestId } = renderWithContext(<App />);

  await fireEvent(getByTestId('persistGate'), 'onBeforeLift');

  expect(configureNotificationHandler).toHaveBeenCalledWith();
  expect(setupFirebaseDynamicLinks).toHaveBeenCalledWith();
  expect(getFeatureFlags).toHaveBeenCalledWith();
});

it('shows offline alert if network request failed', () => {
  testApp({ apiError: { message: NETWORK_REQUEST_FAILED } });

  expect(ReactNative.Alert.alert).toHaveBeenCalledWith(
    youreOffline,
    connectToInternet,
    ...lastTwoArgs,
  );
});

it('should not show alert for expired access token', () => {
  testApp({ apiError: { errors: [{ detail: EXPIRED_ACCESS_TOKEN }] } });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert for invalid access token', () => {
  testApp({ apiError: { errors: [{ detail: INVALID_ACCESS_TOKEN }] } });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert for invalid grant', () => {
  testApp({ apiError: { error: INVALID_GRANT } });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert if not ApiError', () => {
  const message = 'some message\nwith break';

  testApp({
    key: 'test',
    method: '',
    // @ts-ignore // Would be better to test this with ErrorUtils.setGlobalHandler instead of window.onunhandledrejection
    message,
  });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should not show alert if no error message', () => {
  const unknownError = { key: 'test', method: '' };

  testApp(unknownError);

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

  it('Sends Rollbar report for API error', () => {
    const apiError = {
      apiError: { message: 'Error Text' },
      key: 'ADD_NEW_PERSON',
      method: 'POST',
      endpoint: 'apis/v4/people',
      query: { filters: { organization_ids: '1' } },
    };

    testApp(apiError);

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

  it('Sends Rollbar report for JS Error', () => {
    const errorName = 'Error Name';
    const errorDetails = 'Error Details';
    const error = Error(`${errorName}\n${errorDetails}`);

    // @ts-ignore // Would be better to test this with ErrorUtils.setGlobalHandler instead of window.onunhandledrejection
    testApp(error);

    expect(rollbar.error).toHaveBeenCalledWith(error);
  });

  it('Sends Rollbar report for unknown error', () => {
    const unknownError = { key: 'test', method: '' };

    testApp(unknownError);

    expect(rollbar.error).toHaveBeenCalledWith(
      Error(`Unknown Error:\n${JSON.stringify(unknownError, null, 2)}`),
    );
  });
});
