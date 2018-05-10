import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';

import { renderShallow } from '../../testUtils';
import NotificationOffScreen from '../../src/containers/NotificationOffScreen';
import { trackActionWithoutData } from '../../src/actions/analytics';
import { navigateBack } from '../../src/actions/navigation';
import { ACTIONS } from '../../src/constants';

jest.mock('../../src/actions/analytics');
jest.mock('../../src/actions/navigation');

const mockStore = configureStore();
let store;
let screen;

const navigateResult = { type: 'navigated back' };
const trackActionResult = { type: 'tracked action' };
const onClose = jest.fn();

beforeEach(() => {
  store = mockStore();

  screen = renderShallow(
    <NotificationOffScreen navigation={{ state: {} }} onClose={onClose} />,
    store
  );

  trackActionWithoutData.mockReturnValue(trackActionResult);
  navigateBack.mockReturnValue(navigateResult);
});

it('renders', () => {
  expect(screen).toMatchSnapshot();
});

describe('not now button', () => {
  it('should call onClose callback, navigate back, and track an action', () => {
    screen.childAt(1).childAt(2).childAt(1).props().onPress();

    expect(navigateBack).toHaveBeenCalledWith();
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NO_REMINDERS);
    expect(store.getActions()).toEqual([ navigateResult, trackActionResult ]);
  });
});
