import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import LandingScreen from '..';

import {
  createThunkStore,
  testSnapshot,
  renderShallow,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { WELCOME_SCREEN } from '../../WelcomeScreen';
import { firstTime } from '../../../actions/auth/userData';
import {
  JOIN_BY_CODE_ONBOARDING_FLOW,
  SIGN_IN_FLOW,
} from '../../../routes/constants';

jest.mock('../../../actions/auth/userData');

let store;

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigate push' }),
}));

firstTime.mockReturnValue({ type: 'first time' });

beforeEach(() => {
  store = createThunkStore();
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <LandingScreen />
    </Provider>,
  );
});

describe('a button is clicked', () => {
  let screen;

  beforeEach(() => {
    screen = renderShallow(<LandingScreen />, store);
  });

  it('get started to be called', () => {
    screen.find({ name: 'tryItNowButton' }).simulate('press');
    expect(firstTime).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(WELCOME_SCREEN);
  });

  it('community code to be called', () => {
    screen.find({ name: 'communityCodeButton' }).simulate('press');
    expect(navigatePush).toHaveBeenCalledWith(JOIN_BY_CODE_ONBOARDING_FLOW);
  });

  it('sign in button to be called', () => {
    screen.find({ name: 'signInButton' }).simulate('press');
    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_FLOW);
  });
});
