import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';

import AddSomeoneScreen from '../../src/containers/AddSomeoneScreen';
import { renderShallow } from '../../testUtils';
import { trackActionWithoutData } from '../../src/actions/analytics';
import { navigatePush } from '../../src/actions/navigation';
import { ACTIONS } from '../../src/constants';
import { SETUP_PERSON_SCREEN } from '../../src/containers/SetupPersonScreen';

jest.mock('react-native-device-info');
jest.mock('../../src/actions/analytics');
jest.mock('../../src/actions/navigation');

const mockStore = configureStore();
let screen;
let store;

const trackActionResult = { type: 'tracked action' };
const navigateResult = { type: 'navigated' };


beforeEach(() => {
  store = mockStore();

  screen = renderShallow(
    <AddSomeoneScreen />,
    store
  );

  trackActionWithoutData.mockReturnValue(trackActionResult);
  navigatePush.mockReturnValue(navigateResult);
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('onComplete prop', () => {
  it('navigates to the next screen and tracks an action', () => {
    screen.props().onComplete();

    expect(store.getActions()).toEqual([ navigateResult, trackActionResult ]);
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.PERSON_ADDED);
    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });
});

