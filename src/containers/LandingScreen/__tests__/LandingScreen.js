import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import LandingScreen from '..';

import { JOIN_GROUP_SCREEN } from '../../Groups/JoinGroupScreen';
import {
  createMockStore,
  testSnapshot,
  createMockNavState,
  renderShallow,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { LOGIN_OPTIONS_SCREEN } from '../../LoginOptionsScreen';
import { KEY_LOGIN_SCREEN } from '../../KeyLoginScreen';

let store;

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigate push' }),
}));

beforeEach(() => {
  store = createMockStore();
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <LandingScreen navigation={createMockNavState({})} />
    </Provider>,
  );
});

describe('a button is clicked', () => {
  let screen;

  beforeEach(() => {
    screen = renderShallow(
      <LandingScreen navigation={createMockNavState({})} />,
      store,
    );
  });

  it('get started to be called', () => {
    screen.find({ name: 'getStartedButton' }).simulate('press');
    expect(navigatePush).toHaveBeenCalledWith(LOGIN_OPTIONS_SCREEN);
  });

  it('community code to be called', () => {
    screen.find({ name: 'communityCodeButton' }).simulate('press');
    expect(navigatePush).toHaveBeenCalledWith(JOIN_GROUP_SCREEN);
  });

  it('sign in button to be called', () => {
    screen.find({ name: 'signInButton' }).simulate('press');
    expect(navigatePush).toHaveBeenCalledWith(KEY_LOGIN_SCREEN);
  });
});
