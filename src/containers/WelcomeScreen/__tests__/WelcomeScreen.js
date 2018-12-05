import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import WelcomeScreen from '..';

import {
  testSnapshot,
  createMockStore,
  createMockNavState,
} from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';
import * as common from '../../../utils/common';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';
import { KEY_LOGIN_SCREEN } from '../../KeyLoginScreen';

const store = createMockStore();

jest.mock('react-native-device-info');
jest.mock('../../../actions/analytics');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <WelcomeScreen navigation={createMockNavState()} />
    </Provider>,
  );
});

it('renders correctly for allow sign in', () => {
  testSnapshot(
    <Provider store={store}>
      <WelcomeScreen allowSignIn={true} navigation={createMockNavState()} />
    </Provider>,
  );
});

describe('welcome screen methods', () => {
  let component;

  beforeEach(() => {
    const screen = shallow(
      <WelcomeScreen navigation={createMockNavState()} dispatch={jest.fn()} />,
      {
        context: { store },
      },
    );

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

  it('sign in', () => {
    component.signIn();
    expect(navigation.navigatePush).toHaveBeenCalledWith(KEY_LOGIN_SCREEN);
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
