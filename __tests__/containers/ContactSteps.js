import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactSteps from '../../src/containers/ContactSteps';
import { createMockStore, createMockNavState, testSnapshotShallow, renderShallow } from '../../testUtils';
import { navigatePush } from '../../src/actions/navigation';
jest.mock('../../src/actions/navigation');
import { SELECT_MY_STEP_SCREEN } from '../../src/containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../src/containers/PersonSelectStepScreen';
import { buildTrackingObj } from '../../src/utils/common';
import { getStepsByFilter } from '../../src/actions/steps';
jest.mock('../../src/actions/steps');

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
  auth: {
    person: {
      id: '123',
    },
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

const steps = [ { id: '1', title: 'Test Step' } ];
getStepsByFilter.mockReturnValue({ response: steps });

const store = createMockStore(mockState);

const createComponent = (isCurrentUser = false, contactStage, handleSaveNewSteps, handleSaveNewStage, org) => {
  const screen = renderShallow(
    <ContactSteps
      isMe={isCurrentUser}
      person={mockPerson}
      organization={org}
      contactStage={contactStage}
      contactAssignment={mockContactAssignment}
      onChangeStage={jest.fn()}
      navigation={createMockNavState()}
    />,
    store,
  );

  const component = screen.instance();
  handleSaveNewSteps && (component.handleSaveNewSteps = handleSaveNewSteps);
  handleSaveNewStage && (component.handleSaveNewStage = handleSaveNewStage);
  return component;
};

let handleSaveNewStage;
let handleSaveNewSteps;

jest.mock('react-native-device-info');


it('renders correctly', () => {
  testSnapshotShallow(
    <ContactSteps isMe={false} person={mockPerson} navigation={createMockNavState()} />,
    store,
  );
});

describe('getSteps', () => {
  it('should get steps for a personal org', async() => {
    const component = createComponent();
    const loadedSteps = await component.getSteps();
    expect(getStepsByFilter).toHaveBeenCalledWith({ completed: false, receiver_ids: mockPerson.id, organization_ids: 'personal' }, 'receiver');
    expect(component.state).toEqual({ steps });
    expect(loadedSteps).toEqual(steps);
  });
  it('should get steps for a ministry org', async() => {
    const component = createComponent(false, undefined, undefined, undefined, { id: '4' });
    const loadedSteps = await component.getSteps();
    expect(getStepsByFilter).toHaveBeenCalledWith({ completed: false, receiver_ids: mockPerson.id, organization_ids: '4' }, 'receiver');
    expect(component.state).toEqual({ steps });
    expect(loadedSteps).toEqual(steps);
  });
});

describe('handleCreateStep', () => {

  beforeAll(() => {
    handleSaveNewStage = jest.fn();
    handleSaveNewSteps = jest.fn();
  });

  it('navigates to select my steps', () => {
    const component = createComponent(true, mockStage, handleSaveNewSteps, handleSaveNewStage);
    component.handleCreateStep();

    expect(navigatePush).toHaveBeenCalledWith(
      SELECT_MY_STEP_SCREEN,
      { onSaveNewSteps: expect.any(Function), enableBackButton: true, contactStage: mockStage }
    );
  });

  it('navigates to select my stage', () => {
    const component = createComponent(true, undefined, handleSaveNewSteps, handleSaveNewStage);
    component.handleCreateStep();

    expect(component.props.onChangeStage).toHaveBeenCalledWith(true, handleSaveNewStage);
  });

  it('navigates to person steps', () => {
    const component = createComponent(false, mockStage, handleSaveNewSteps, handleSaveNewStage);
    component.handleCreateStep();

    expect(navigatePush).toHaveBeenCalledWith(
      PERSON_SELECT_STEP_SCREEN,
      { contactName: mockPerson.first_name,
        contactId: mockPerson.id,
        contact: mockPerson,
        contactStage: mockStage,
        organization: undefined,
        onSaveNewSteps: expect.any(Function),
        createStepTracking: buildTrackingObj('people : person : steps : create', 'people', 'person', 'steps'),
      },
    );
  });

  it('navigates to person stage', () => {
    const component = createComponent(false, undefined, handleSaveNewSteps, handleSaveNewStage);

    component.handleCreateStep();
    expect(component.props.onChangeStage).toHaveBeenCalledWith(true, handleSaveNewStage);
  });
});


describe('handleSaveNewStage', () => {
  beforeAll(() => {
    handleSaveNewSteps = jest.fn();
  });

  it('navigates from my stage to my steps', () => {
    const component = createComponent(true, undefined, handleSaveNewSteps);
    component.handleSaveNewStage(mockStage);

    expect(navigatePush).toHaveBeenCalledWith(
      SELECT_MY_STEP_SCREEN, {
        onSaveNewSteps: expect.any(Function),
        enableBackButton: true,
        contactStage: mockStage,
      },
    );
  });

  it('navigates from person stage to person steps', () => {
    const component = createComponent(false, undefined, handleSaveNewSteps);
    component.handleSaveNewStage(mockStage);

    expect(navigatePush).toHaveBeenCalledWith(
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
