import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';

import AddSomeoneScreen from '../AddSomeoneScreen';
import { renderShallow } from '../../../testUtils';
import { navigatePush } from '../../actions/navigation';
import { SETUP_PERSON_SCREEN } from '../SetupPersonScreen';

jest.mock('react-native-device-info');
jest.mock('../../actions/navigation');

const mockStore = configureStore();
let screen;
let store;

const navigateResult = { type: 'navigated' };

beforeEach(() => {
  store = mockStore();

  screen = renderShallow(<AddSomeoneScreen />, store);

  navigatePush.mockReturnValue(navigateResult);
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('onComplete prop', () => {
  it('navigates to the next screen', () => {
    screen.props().onComplete();

    expect(store.getActions()).toEqual([navigateResult]);
    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });
});
