import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Note: test renderer must be required after react-native.
import NotificationPrimerScreen from '../../src/containers/NotificationPrimerScreen';
import { Provider } from 'react-redux';
import { createMockStore, createMockNavState, testSnapshot } from '../../testUtils';
import { setupPushNotifications, enableAskPushNotification, disableAskPushNotification } from '../../src/actions/notifications';

const store = createMockStore();

jest.mock('react-native-device-info');
jest.mock('../../src/actions/notifications', () => ({
  setupPushNotifications: jest.fn(() => Promise.resolve()),
  enableAskPushNotification: jest.fn(),
  disableAskPushNotification: jest.fn(),
}));

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
    Enzyme.configure({ adapter: new Adapter() });
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
  });

  it('runs allow', () => {
    component.allow();
    expect(enableAskPushNotification).toHaveBeenCalledTimes(1);
    expect(setupPushNotifications).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});