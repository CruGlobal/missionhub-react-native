import React from 'react';
import ReactNative from 'react-native';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';

import App from '../src/App';
import { EXPIRED_ACCESS_TOKEN, NETWORK_REQUEST_FAILED } from '../src/constants';
import locale from '../src/i18n/locales/en-US';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-native-default-preference', () => ({
  get: jest.fn().mockReturnValue(Promise.reject()),
}));
jest.mock('react-native-omniture');
global.window = {};

const { youreOffline, connectToInternet } = locale.offline;
const { error, unexpectedErrorMessage, baseErrorMessage, ADD_NEW_PERSON } = locale.error;

const lastTwoArgs = [
  [ { text: 'Ok', onPress: expect.anything() } ],
  { onDismiss: expect.anything() },
];

beforeEach(() => ReactNative.Alert.alert = jest.fn().mockImplementation((_, __, buttons) => buttons[0].onPress()));

const test = (response) => {
  const shallowScreen = shallow(<App />);

  shallowScreen.instance().handleError(response);
};

it('shows offline alert if network request failed', () => {
  test({ apiError: { message: NETWORK_REQUEST_FAILED } });

  expect(ReactNative.Alert.alert).toHaveBeenCalledWith(youreOffline, connectToInternet, ...lastTwoArgs);
});

it('should not show alert for expired access token', () => {
  test({ apiError: { errors: [ { detail: EXPIRED_ACCESS_TOKEN } ] } });

  expect(ReactNative.Alert.alert).not.toHaveBeenCalled();
});

it('should show specific error message if request has it', () => {
  test({ apiError: {}, key: 'ADD_NEW_PERSON', method: '', message: '' });

  expect(ReactNative.Alert.alert).toHaveBeenCalledWith(error, `${ADD_NEW_PERSON} ${baseErrorMessage}`, ...lastTwoArgs);
});

it('should show generic error message if request does not have it', () => {
  test({ apiError: {}, key: 'test', method: '', message: '' });

  expect(ReactNative.Alert.alert).toHaveBeenCalledWith(error, `${unexpectedErrorMessage} ${baseErrorMessage}`, ...lastTwoArgs);
});

//todo get this test working
xit('should show not show alert if an alert modal is already up', async() => {
  ReactNative.Alert.alert = jest.fn();
  const error = { apiError: {}, key: 'test', method: '', message: '' };

  await test(error);
  await test(error);

  return expect(ReactNative.Alert.alert).toHaveBeenCalledTimes(1);
});
