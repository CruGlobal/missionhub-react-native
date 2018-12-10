import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow, testSnapshot } from '../../../../testUtils';

import SetupScreen from '..';

import * as profile from '../../../actions/onboardingProfile';
import callApi, { REQUESTS } from '../../../actions/api';

const store = configureStore([thunk])({ profile: {} });
const next = jest.fn(() => ({ type: 'testNext' }));

const firstName = 'TestFname';
const lastName = 'TestLname';

jest.mock('react-native-device-info');
jest.mock('../../../actions/api');

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SetupScreen next={next} />
    </Provider>,
  );
});

describe('setup screen methods', () => {
  const instance = renderShallow(<SetupScreen />, store).instance();
  profile.firstNameChanged = jest.fn(() => ({
    type: 'testFirstNameChanged',
  }));
  profile.lastNameChanged = jest.fn(() => ({
    type: 'testLastNameChanged',
  }));
  instance.lastName = { focus: jest.fn() };
  it('calls first name changed', () => {
    instance.updateFirstName(firstName);
    expect(profile.firstNameChanged).toHaveBeenCalledWith(firstName);
  });
  it('calls last name changed', () => {
    instance.updateLastName(lastName);
    expect(profile.lastNameChanged).toHaveBeenCalledWith(lastName);
  });
  it('calls on submit editing', () => {
    instance.onSubmitEditing();
    expect(instance.lastName.focus).toHaveBeenCalled();
  });
  describe('saveAndGoToGetStarted', () => {
    it('creates person and calls next', async () => {
      callApi.mockReturnValue(() => Promise.resolve({ person_id: '123' }));
      const store = configureStore([thunk])({ profile: { firstName } });
      const instance = renderShallow(
        <SetupScreen next={next} />,
        store,
      ).instance();

      await instance.saveAndGoToGetStarted();

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.CREATE_MY_PERSON,
        {},
        expect.objectContaining({ first_name: firstName }),
      );
      expect(next).toHaveBeenCalled();
      expect(store.getActions()).toEqual([{ type: 'testNext' }]);
    });
    it('does nothing if first name is not entered', async () => {
      await instance.saveAndGoToGetStarted();

      expect(store.getActions()).toEqual([]);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
