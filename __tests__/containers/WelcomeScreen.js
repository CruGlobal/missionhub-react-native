import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import WelcomeScreen from '../../src/containers/WelcomeScreen';
import { testSnapshot, createMockStore } from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import * as common from '../../src/utils/common';
import { trackActionWithoutData } from '../../src/actions/analytics';
import { ACTIONS } from '../../src/constants';

const store = createMockStore();

jest.mock('react-native-device-info');
jest.mock('../../src/actions/analytics');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <WelcomeScreen />
    </Provider>,
  );
});

describe('welcome screen methods', () => {
  let component;

  beforeEach(() => {
    const screen = shallow(<WelcomeScreen dispatch={() => {}} />, {
      context: { store },
    });

    component = screen
      .dive()
      .dive()
      .dive()
      .instance();
  });

  it('navigates', () => {
    navigation.navigatePush = jest.fn();
    common.disableBack = { add: jest.fn(), remove: jest.fn() };

    component.navigateToNext();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('unmounts', () => {
    common.disableBack = { add: jest.fn(), remove: jest.fn() };
    component.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });

  describe('component will mount', () => {
    it('tracks an action', () => {
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.ONBOARDING_STARTED,
      );
    });
  });
});
