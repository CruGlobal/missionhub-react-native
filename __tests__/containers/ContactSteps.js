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
import { getContactSteps } from '../../src/actions/steps';
jest.mock('../../src/actions/steps');

const steps = [
  { id: '1', title: 'Test Step' },
];

const mockState = {
  steps: {
    mine: [],
    contactSteps: {
      '1-personal': steps,
    },
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

getContactSteps.mockReturnValue({ response: steps });

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


it('renders correctly with no steps', () => {
  testSnapshotShallow(
    <ContactSteps isMe={false} person={mockPerson} navigation={createMockNavState()} />,
    createMockStore({
      ...mockState,
      steps: {
        ...mockState.steps,
        contactSteps: {},
      },
    }),
  );
});

it('renders correctly with steps', () => {
  testSnapshotShallow(
    <ContactSteps isMe={false} person={mockPerson} navigation={createMockNavState()} />,
    store,
  );
});

describe('getSteps', () => {
  it('should get steps for a personal org', async() => {
    createComponent();
    expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, undefined);
  });
  it('should get steps for a ministry org', async() => {
    const org = { id: '4' };
    createComponent(false, undefined, undefined, undefined, org);
    expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, org.id);
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
