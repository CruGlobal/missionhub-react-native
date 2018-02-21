import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import SetupPersonScreen from '../../src/containers/SetupPersonScreen';
import { testSnapshot, createMockStore } from '../../testUtils';
import * as profile from '../../src/actions/onboardingProfile';
jest.mock('../../src/actions/onboardingProfile');
import * as navigation from '../../src/actions/navigation';
import * as person from '../../src/actions/person';

const mockState = {
  personProfile: {
    personFirstName: '',
    personLastName: '',
  },
};

let store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SetupPersonScreen />
    </Provider>
  );
});


describe('setup person screen methods', () => {
  let component;
  Enzyme.configure({ adapter: new Adapter() });
  profile.createPerson = jest.fn();
  profile.updateOnboardingPerson = jest.fn();
  person.resetPerson = jest.fn();
  navigation.navigatePush = jest.fn();

  beforeEach(() => {
    store = createMockStore({
      ...mockState,
      personProfile: {
        ...mockState.personProfile,
        personFirstName: 'Test',
      },
    });
    const screen = shallow(
      <SetupPersonScreen />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
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

  it('resets person on unmount', () => {
    component.componentWillUnmount();

    expect(profile.resetPerson).toHaveBeenCalledTimes(1);
  });
});
