import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import NotificationPrimerScreen from '../../src/containers/NotificationPrimerScreen';
import { createMockNavState, testSnapshot } from '../../testUtils';
import { registerNotificationHandler, enableAskPushNotification, disableAskPushNotification } from '../../src/actions/notifications';
import { trackActionWithoutData } from '../../src/actions/analytics';
import { ACTIONS } from '../../src/constants';

const mockStore = configureStore([ thunk ]);
let store;

jest.mock('react-native-device-info');
jest.mock('../../src/actions/notifications');
jest.mock('../../src/actions/analytics');

const enableResult = { type: 'test enable' };
const disableResult = { type: 'test disable' };
const registerResult = { type: 'register' };
const trackActionResult = { type: 'tracked action' };

beforeEach(() => {
  registerNotificationHandler.mockReturnValue((dispatch) => {
    dispatch(registerResult);
    return Promise.resolve();
  });
  enableAskPushNotification.mockReturnValue(enableResult);
  disableAskPushNotification.mockReturnValue(disableResult);

  trackActionWithoutData.mockReturnValue(trackActionResult);

  store = mockStore();
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen navigation={createMockNavState({
        onComplete: jest.fn(),
      })} />
    </Provider>
  );
});

describe('notification primer methods', () => {
  let component;
  const mockComplete = jest.fn();

  beforeEach(() => {
    mockComplete.mockReset();

    const screen = shallow(
      <NotificationPrimerScreen navigation={createMockNavState({
        onComplete: mockComplete,
      })} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('runs not now', () => {
    component.notNow();

    expect(disableAskPushNotification).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NOT_NOW);
    expect(store.getActions()).toEqual([ disableResult, trackActionResult ]);
  });

  it('runs allow', async() => {
    await component.allow();

    expect(enableAskPushNotification).toHaveBeenCalledTimes(1);
    expect(registerNotificationHandler).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
    expect(store.getActions()).toEqual([ enableResult, registerResult, trackActionResult ]);
  });
});
