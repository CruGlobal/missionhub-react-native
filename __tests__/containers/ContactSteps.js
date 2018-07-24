import 'react-native';
import React from 'react';

import ContactSteps from '../../src/containers/ContactSteps';
import {
  createMockStore,
  createMockNavState,
  testSnapshotShallow,
  renderShallow,
} from '../../testUtils';
import { navigatePush } from '../../src/actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../../src/containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../src/containers/PersonSelectStepScreen';
import { buildTrackingObj } from '../../src/utils/common';
import { getContactSteps } from '../../src/actions/steps';
import { contactAssignmentSelector } from '../../src/selectors/people';
import { assignContactAndPickStage } from '../../src/actions/misc';
import { promptToAssign } from '../../src/utils/promptToAssign';
import { navigateToStageScreen } from '../../src/actions/misc';

jest.mock('../../src/actions/steps');
jest.mock('../../src/actions/navigation');
jest.mock('../../src/selectors/people');
jest.mock('react-native-device-info');
jest.mock('../../src/actions/misc');
jest.mock('../../src/utils/promptToAssign');

const steps = [{ id: '1', title: 'Test Step' }];

const myId = '123';
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
      id: myId,
    },
  },
};

const mockPerson = {
  first_name: 'ben',
  id: 1,
  reverse_contact_assignments: [],
};

const mockContactAssignment = {
  id: 333,
};

const trackingObj = buildTrackingObj(
  'people : person : steps : add',
  'people',
  'person',
  'steps',
);

getContactSteps.mockReturnValue({ response: steps });

const store = createMockStore(mockState);

const createComponent = (isCurrentUser = false, contactStage, org) =>
  renderShallow(
    <ContactSteps
      isMe={isCurrentUser}
      person={mockPerson}
      organization={org}
      contactStage={contactStage}
      onChangeStage={jest.fn()}
      navigation={createMockNavState()}
    />,
    store,
  ).instance();

it('renders correctly with no steps', () => {
  testSnapshotShallow(
    <ContactSteps
      isMe={false}
      person={mockPerson}
      navigation={createMockNavState()}
    />,
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
    <ContactSteps
      isMe={false}
      person={mockPerson}
      navigation={createMockNavState()}
    />,
    store,
  );
});

describe('getSteps', () => {
  it('should get steps for a personal org', async () => {
    createComponent();
    expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, undefined);
  });
  it('should get steps for a ministry org', async () => {
    const org = { id: '4' };
    createComponent(false, undefined, org);
    expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, org.id);
  });
});

describe('handleCreateStep', () => {
  it('navigates to select my steps', () => {
    contactAssignmentSelector.mockReturnValue(null);
    const component = renderShallow(
      <ContactSteps
        person={{ ...mockPerson, id: myId }}
        navigation={createMockNavState()}
      />,
      store,
    ).instance();

    component.handleCreateStep();

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
      onSaveNewSteps: expect.any(Function),
      enableBackButton: true,
      trackingObj,
    });
  });

  it('navigates to select stage', () => {
    contactAssignmentSelector.mockReturnValue(mockContactAssignment);
    const component = renderShallow(
      <ContactSteps person={mockPerson} navigation={createMockNavState()} />,
      store,
    ).instance();

    component.handleCreateStep();

    expect(navigateToStageScreen).toHaveBeenCalledWith(
      false,
      mockPerson,
      mockContactAssignment,
      undefined,
      null,
    );
  });

  it('navigates to person steps', () => {
    contactAssignmentSelector.mockReturnValue({
      ...mockContactAssignment,
      pathway_stage_id: '2',
    });
    const component = renderShallow(
      <ContactSteps person={mockPerson} navigation={createMockNavState()} />,
      store,
    ).instance();

    component.handleCreateStep();

    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      contactName: mockPerson.first_name,
      contactId: mockPerson.id,
      contact: mockPerson,
      organization: undefined,
      onSaveNewSteps: expect.any(Function),
      createStepTracking: buildTrackingObj(
        'people : person : steps : create',
        'people',
        'person',
        'steps',
      ),
      trackingObj,
    });
  });

  it('assigns the contact to me', async () => {
    contactAssignmentSelector.mockReturnValue(null);
    promptToAssign.mockReturnValue(Promise.resolve(true));
    const component = renderShallow(
      <ContactSteps person={mockPerson} navigation={createMockNavState()} />,
      store,
    ).instance();

    await component.handleCreateStep();

    expect(assignContactAndPickStage).toHaveBeenCalledWith(
      mockPerson.id,
      undefined,
      myId,
    );
  });
});
