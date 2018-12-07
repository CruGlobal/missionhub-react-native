import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import i18next from 'i18next';

import NotificationPrimerScreen from '..';

import {
  createMockNavState,
  testSnapshot,
  renderShallow,
} from '../../../../testUtils';
import { requestNativePermissions } from '../../../actions/notifications';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';

const mockStore = configureStore([thunk]);
let store;

jest.mock('react-native-device-info');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');

const registerResult = { type: 'request permissions' };
const trackActionResult = { type: 'tracked action' };

beforeEach(() => {
  requestNativePermissions.mockReturnValue(dispatch => {
    dispatch(registerResult);
    return Promise.resolve();
  });

  trackActionWithoutData.mockReturnValue(trackActionResult);

  store = mockStore();
});

it('renders correctly for onboarding', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t(
            'notificationPrimer:onboardingDescription',
          ),
        })}
      />
    </Provider>,
  );
});

it('renders correctly without description passed in', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
        })}
      />
    </Provider>,
  );
});

it('renders correctly for focused step', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t('notificationPrimer:focusDescription'),
        })}
      />
    </Provider>,
  );
});

it('renders correctly for after login', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          descriptionText: i18next.t('notificationPrimer:loginDescription'),
        })}
      />
    </Provider>,
  );
});

describe('notification primer methods', () => {
  let component;
  const mockComplete = jest.fn();

  beforeEach(() => {
    mockComplete.mockReset();
  });

  const createComponent = (props = {}) => {
    const screen = renderShallow(
      <NotificationPrimerScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          ...props,
        })}
      />,
      store,
    );

    return screen.instance();
  };

  it('runs not now', () => {
    component = createComponent();

    component.notNow();

    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NOT_NOW);
    expect(store.getActions()).toEqual([trackActionResult]);
  });

  it('runs allow', async () => {
    component = createComponent();

    await component.allow();

    expect(requestNativePermissions).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ALLOW);
    expect(store.getActions()).toEqual([registerResult, trackActionResult]);
  });
});
