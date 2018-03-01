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
  reverse_contact_assignments: [ ],
};

const mockStage = {
  name: 'forgiven',
  id: 2,
};

const mockContactAssignment = {
  id: 333,
};

const store = createMockStore(mockState);

const createComponent = (isCurrentUser, contactStage, handleSaveNewSteps, handleSaveNewStage = null) => {
  const screen = shallow(
    <ContactSteps
      isMe={isCurrentUser}
      person={mockPerson}
      contactStage={contactStage}
      contactAssignment={mockContactAssignment}
      onChangeStage={jest.fn()}
      navigation={createMockNavState()}
    />,
    { context: { store } },
  );

  let component = screen.dive().dive().dive().instance();
  component.handleSaveNewSteps = handleSaveNewSteps;
  if (handleSaveNewStage) component.handleSaveNewStage = handleSaveNewStage;
  return component;
};

let handleSaveNewStage;
let handleSaveNewSteps;
navigation.navigatePush = jest.fn();
navigation.navigateBack = jest.fn();

jest.mock('react-native-device-info');


it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactSteps isMe={false} person={mockPerson} navigation={createMockNavState()} />
    </Provider>
  );
});


describe('handleCreateStep', () => {

  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    handleSaveNewStage = jest.fn();
    handleSaveNewSteps = jest.fn();
  });

  it('navigates to select my steps', () => {
    let component = createComponent(true, 'forgiven', handleSaveNewSteps, handleSaveNewStage);
    component.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      SELECT_MY_STEP_SCREEN,
      { onSaveNewSteps: expect.any(Function), enableBackButton: true, contactStage: 'forgiven' }
    );
  });

  it('navigates to select my stage', () => {
    let component = createComponent(true, undefined, handleSaveNewSteps, handleSaveNewStage);
    component.handleCreateStep();

    expect(component.props.onChangeStage).toHaveBeenCalledWith(true, handleSaveNewStage);
  });

  it('navigates to person steps', () => {
    let component = createComponent(false, 'forgiven', handleSaveNewSteps, handleSaveNewStage);
    component.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      PERSON_SELECT_STEP_SCREEN,
      { contactName: mockPerson.first_name,
        contactId: mockPerson.id,
        contact: mockPerson,
        contactStage: 'forgiven',
        organization: undefined,
        onSaveNewSteps: expect.any(Function),
        createStepTracking: buildTrackingObj('people : person : steps : create', 'people', 'person', 'steps'),
      },
    );
  });

  it('navigates to person stage', () => {
    let component = createComponent(false, undefined, handleSaveNewSteps, handleSaveNewStage);

    component.handleCreateStep();
    expect(component.props.onChangeStage).toHaveBeenCalledWith(true, handleSaveNewStage);
  });
});


describe('handleSaveNewSteps', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    handleSaveNewSteps = jest.fn();
  });

  it('navigates from my stage to my steps', () => {
    let component = createComponent(true, undefined, handleSaveNewSteps);
    component.handleSaveNewStage(mockStage);

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      SELECT_MY_STEP_SCREEN, {
        onSaveNewSteps: expect.any(Function),
        enableBackButton: true,
        contactStage: mockStage,
      },
    );
  });

  it('navigates from person stage to person steps', () => {
    let component = createComponent(false, undefined, handleSaveNewSteps);
    component.handleSaveNewStage(mockStage);

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      PERSON_SELECT_STEP_SCREEN, {
        contactName: mockPerson.first_name,
        contactId: mockPerson.id,
        contact: mockPerson,
        organization: undefined,
        contactStage: mockStage,
        onSaveNewSteps: expect.any(Function),
        createStepTracking: buildTrackingObj('people : person : steps : create', 'people', 'person', 'steps'),
      },
    );
  });
});

