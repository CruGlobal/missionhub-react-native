import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SetupPersonScreen from '../../src/containers/SetupPersonScreen';
import { testSnapshot } from '../../testUtils';
import * as profile from '../../src/actions/onboardingProfile';
import * as navigation from '../../src/actions/navigation';
import * as person from '../../src/actions/person';
import { trackActionWithoutData } from '../../src/actions/analytics';
import { ACTIONS } from '../../src/constants';

jest.mock('../../src/actions/onboardingProfile');
jest.mock('react-native-device-info');
jest.mock('../../src/actions/analytics');

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([thunk]);
let store;

const mockState = {
  personProfile: {
    personFirstName: '',
    personLastName: '',
  },
  auth: {
    person: {
      id: '1',
    },
  },
};

const trackActionResult = { type: 'tracked action' };
const navigationResult = { type: 'navigated' };

it('renders correctly', () => {
  testSnapshot(
    <Provider store={mockStore(mockState)}>
      <SetupPersonScreen />
    </Provider>,
  );
});

describe('setup person screen methods', () => {
  let component;

  beforeEach(() => {
    store = mockStore({
      ...mockState,
      personProfile: {
        ...mockState.personProfile,
        personFirstName: 'Test',
      },
    });

    const screen = shallow(<SetupPersonScreen />, { context: { store } });

    component = screen
      .dive()
      .dive()
      .dive()
      .instance();

    profile.createPerson = jest
      .fn()
      .mockReturnValue(() => Promise.resolve({ response: { id: '2' } }));
    profile.updateOnboardingPerson = jest.fn();
    person.resetPerson = jest.fn();
    navigation.navigatePush = jest.fn().mockReturnValue(navigationResult);
    trackActionWithoutData.mockReturnValue(trackActionResult);
  });

  it('navigates away', () => {
    component.navigate();

    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('saves and creates person', () => {
    component.saveAndGoToGetStarted();

    expect(profile.createPerson).toHaveBeenCalledTimes(1);
  });

  it('saves and updates person', () => {
    component.setState({ personId: 1 });
    component.saveAndGoToGetStarted();

    expect(profile.updateOnboardingPerson).toHaveBeenCalledTimes(1);
  });

  it('tracks an action', async () => {
    await component.saveAndGoToGetStarted();

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.PERSON_ADDED);
    expect(store.getActions()).toEqual([trackActionResult, navigationResult]);
  });

  it('on submit editing', () => {
    component.personLastName = { focus: jest.fn() };
    component.onSubmitEditing();

    expect(component.personLastName.focus).toHaveBeenCalled();
  });

  it('on update person first name', () => {
    profile.personFirstNameChanged = jest.fn(() => ({ type: 'test' }));
    const val = 'test';
    component.updatePersonFirstName(val);

    expect(profile.personFirstNameChanged).toHaveBeenCalledWith(val);
  });

  it('on update person last name', () => {
    profile.personLastNameChanged = jest.fn(() => ({ type: 'test' }));
    const val = 'test';
    component.updatePersonLastName(val);

    expect(profile.personLastNameChanged).toHaveBeenCalledWith(val);
  });
});
