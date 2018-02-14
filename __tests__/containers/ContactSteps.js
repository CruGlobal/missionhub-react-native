import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import ContactSteps from '../../src/containers/ContactSteps';
import { Provider } from 'react-redux';
import { createMockStore, createMockNavState, testSnapshot } from '../../testUtils';
import Adapter from 'enzyme-adapter-react-16/build/index';
import * as navigation from '../../src/actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../../src/containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../src/containers/PersonSelectStepScreen';
import { buildTrackingObj } from '../../src/utils/common';

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
  auth: {
    personId: 123,
  },
};

const mockPerson = {
  first_name: 'ben',
  id: 1,
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactSteps isMe={false} person={mockPerson} navigation={createMockNavState()} />
    </Provider>
  );
});


describe('Navigation to steps screen', () => {
  Enzyme.configure({ adapter: new Adapter() });
  navigation.navigatePush = jest.fn();
  const onSaveNewSteps = jest.fn();

  const createComponent = (isCurrentUser) => {
    const screen = shallow(
      <ContactSteps
        isMe={isCurrentUser}
        person={mockPerson}
        navigation={createMockNavState()}
      />,
      { context: { store } },
    );

    let component = screen.dive().dive().dive().instance();
    component.handleSaveNewSteps = onSaveNewSteps;
    return component;
  };

  it('navigates to my steps', () => {
    let component = createComponent(true);

    component.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      SELECT_MY_STEP_SCREEN,
      { onSaveNewSteps, enableBackButton: true }
    );
  });

  it('navigates to person steps', () => {
    let component = createComponent(false);

    component.handleCreateStep();
    expect(navigation.navigatePush).toHaveBeenCalledWith(
      PERSON_SELECT_STEP_SCREEN,
      { contactName: mockPerson.first_name,
        contactId: mockPerson.id,
        contact: mockPerson,
        onSaveNewSteps,
        createStepTracking: buildTrackingObj('people : person : steps : create', 'people', 'person', 'steps'),
      },
    );
  });
});

