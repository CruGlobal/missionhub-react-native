import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SetupPersonScreen from '../SetupPersonScreen';
import { testSnapshot } from '../../../testUtils';
import * as profile from '../../actions/onboardingProfile';
import * as navigation from '../../actions/navigation';
import * as person from '../../actions/person';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

jest.mock('../../actions/onboardingProfile');
jest.mock('react-native-device-info');
jest.mock('../../actions/analytics');

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

const personId = '2';

const trackActionResult = { type: 'tracked action' };
const navigationResult = { type: 'navigated' };
const nextResult = { type: 'next' };

it('renders correctly', () => {
  testSnapshot(
    <Provider store={mockStore(mockState)}>
      <SetupPersonScreen />
    </Provider>,
  );
});

it('renders back arrow correctly', () => {
  testSnapshot(
    <Provider store={mockStore(mockState)}>
      <SetupPersonScreen hideSkipBtn={true} />
    </Provider>,
  );
});

describe('setup person screen methods', () => {
  let component;

  const next = jest.fn();

  beforeEach(() => {
    next.mockReturnValue(nextResult);

    store = mockStore({
      ...mockState,
      personProfile: {
        ...mockState.personProfile,
        personFirstName: 'Test',
      },
    });

    const screen = shallow(<SetupPersonScreen next={next} />, {
      context: { store },
    });

    component = screen
      .dive()
      .dive()
      .instance();

    profile.createPerson = jest
      .fn()
      .mockReturnValue(() => Promise.resolve({ response: { id: personId } }));
    profile.updateOnboardingPerson = jest
      .fn()
      .mockReturnValue(() => Promise.resolve({ response: { id: personId } }));
    person.resetPerson = jest.fn();
    navigation.navigateBack = jest.fn().mockReturnValue(navigationResult);
    trackActionWithoutData.mockReturnValue(trackActionResult);
  });

  it('navigates away', () => {
    component.navigate();

    expect(next).toHaveBeenCalledWith({ skip: false, personId: null });
    expect(store.getActions()).toEqual([nextResult]);
  });

  it('saves and creates person', async () => {
    await component.saveAndGoToGetStarted();

    expect(profile.createPerson).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ skip: false, personId });
    expect(store.getActions()).toEqual([trackActionResult, nextResult]);
  });

  it('saves and updates person', async () => {
    component.setState({ personId });
    await component.saveAndGoToGetStarted();

    expect(profile.updateOnboardingPerson).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ skip: false, personId });
    expect(store.getActions()).toEqual([nextResult]);
  });

  it('tracks an action', async () => {
    await component.saveAndGoToGetStarted();

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.PERSON_ADDED);
    expect(next).toHaveBeenCalledWith({ skip: false, personId });
    expect(store.getActions()).toEqual([trackActionResult, nextResult]);
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

  it('calls skip', () => {
    component.skip();

    expect(next).toHaveBeenCalledWith({ skip: true, personId: null });
    expect(store.getActions()).toEqual([nextResult]);
  });

  it('calls back', () => {
    component.back();

    expect(navigation.navigateBack).toHaveBeenCalledTimes(1);
  });
});
