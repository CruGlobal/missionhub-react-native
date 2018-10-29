import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import {
  createMockStore,
  renderShallow,
  testSnapshot,
} from '../../../../testUtils';

import SetupScreen from '..';

import * as profile from '../../../actions/onboardingProfile';

const store = createMockStore({ profile: {} });

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SetupScreen />
    </Provider>,
  );
});

describe('setup screen methods', () => {
  const instance = renderShallow(<SetupScreen />, store).instance();
  profile.firstNameChanged = jest.fn();
  profile.lastNameChanged = jest.fn();
  instance.lastName = { focus: jest.fn() };
  it('calls first name changed', () => {
    instance.updateFirstName('test');
    expect(profile.firstNameChanged).toHaveBeenCalledWith('test');
  });
  it('calls last name changed', () => {
    instance.updateLastName('test');
    expect(profile.lastNameChanged).toHaveBeenCalledWith('test');
  });
  it('calls on submit editing', () => {
    instance.onSubmitEditing();
    expect(instance.lastName.focus).toHaveBeenCalled();
  });
});
