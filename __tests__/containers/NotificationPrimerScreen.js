import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import NotificationPrimerScreen from '../../src/containers/NotificationPrimerScreen';
import { Provider } from 'react-redux';
import { createMockStore, createMockNavState, testSnapshot, renderShallow } from '../../testUtils';
import { registerNotificationHandler, enableAskPushNotification, disableAskPushNotification } from '../../src/actions/notifications';

const store = createMockStore();

jest.mock('react-native-device-info');
jest.mock('../../src/actions/notifications', () => ({
  registerNotificationHandler: jest.fn(() => Promise.resolve()),
  enableAskPushNotification: jest.fn(),
  disableAskPushNotification: jest.fn(),
}));

it('renders correctly for onboarding', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen navigation={createMockNavState({
        onComplete: jest.fn(),
        isOnboarding: true,
      })} />
    </Provider>
  );
});

it('renders correctly for focused step', () => {
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
    mockComplete.mockClear();
  })

  const createComponent = (props = {}) => {
    const screen = renderShallow(
      <NotificationPrimerScreen navigation={createMockNavState({
        onComplete: mockComplete,
        ...props,
      })} />,
      store,
    );

    return screen.instance();
  };

  it('runs not now', () => {
    component = createComponent();

    component.notNow();

    expect(disableAskPushNotification).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('runs not now for onboarding', () => {
    component = createComponent({ isOnboarding: true });

    component.notNow();

    expect(enableAskPushNotification).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('runs allow', async() => {
    component = createComponent();

    await component.allow();

    expect(registerNotificationHandler).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});
