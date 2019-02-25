/* eslint max-lines-per-function: 0 */

import 'react-native';
import React from 'react';

import ContactSteps from '..';

import {
  createMockStore,
  createMockNavState,
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../../SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../PersonSelectStepScreen';
import { buildTrackingObj } from '../../../utils/common';
import { getContactSteps } from '../../../actions/steps';
import { contactAssignmentSelector } from '../../../selectors/people';
import { assignContactAndPickStage } from '../../../actions/misc';
import { promptToAssign } from '../../../utils/promptToAssign';
import { navigateToStageScreen } from '../../../actions/misc';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/misc');
jest.mock('../../../utils/promptToAssign');
jest.mock('../../../actions/swipe');
jest.mock('../../../actions/journey');

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
let component;
let instance;

const createComponent = (isCurrentUser = false, person, org) => {
  component = renderShallow(
    <ContactSteps
      isMe={isCurrentUser}
      person={person}
      organization={org}
      navigation={createMockNavState()}
    />,
    store,
  );
  instance = component.instance();
};

beforeEach(() => {
  jest.clearAllMocks();
});

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

it('renders row', () => {
  createComponent(false, mockPerson);

  expect(
    component
      .childAt(0)
      .childAt(0)
      .props()
      .renderItem({ item: steps[0] }),
  ).toMatchSnapshot();
});

describe('getSteps', () => {
  it('should get steps for a personal org', () => {
    createComponent(false, mockPerson);
    expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, undefined);
  });
  it('should get steps for a ministry org', () => {
    const org = { id: '4' };
    createComponent(false, mockPerson, org);
    expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, org.id);
  });
});

describe('handleComplete', () => {
  it('triggers complete step flow', async () => {
    createComponent(false, mockPerson);
    await instance.handleComplete(steps[0]);
    expect(getContactSteps).toHaveBeenCalled();
  });
});

describe('handleSaveNewSteps', () => {
  it('saves new steps', async () => {
    createComponent(false, mockPerson);
    await instance.handleSaveNewSteps();
    expect(getContactSteps).toHaveBeenCalled();
    expect(navigateBack).toHaveBeenCalled();
  });
});

describe('handleCreateStep', () => {
  it('navigates to select my steps', () => {
    contactAssignmentSelector.mockReturnValue(null);
    createComponent(true, { ...mockPerson, id: myId });

    instance.handleCreateStep();

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
      onSaveNewSteps: expect.any(Function),
      enableBackButton: true,
      trackingObj,
    });
  });

  it('navigates to select stage', () => {
    contactAssignmentSelector.mockReturnValue(mockContactAssignment);
    createComponent(false, mockPerson);

    instance.handleCreateStep();

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
    createComponent(false, mockPerson);

    instance.handleCreateStep();

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

  it('assigns the contact to me with prompt', async () => {
    contactAssignmentSelector.mockReturnValue(null);
    promptToAssign.mockReturnValue(Promise.resolve(true));
    createComponent(false, mockPerson);

    await instance.handleCreateStep();

    expect(assignContactAndPickStage).toHaveBeenCalledWith(
      mockPerson,
      undefined,
      myId,
    );
  });

  it('assigns the contact to me without prompt', async () => {
    const mockOrg = { id: '1111', user_created: true };
    contactAssignmentSelector.mockReturnValue(null);
    promptToAssign.mockReturnValue(Promise.resolve(true));
    createComponent(false, mockPerson, mockOrg);

    await instance.handleCreateStep();

    expect(assignContactAndPickStage).toHaveBeenCalledWith(
      mockPerson,
      mockOrg,
      myId,
    );
    expect(promptToAssign).not.toHaveBeenCalled();
  });
});

it('should call key extractor', () => {
  createComponent(false, mockPerson);

  const item = { id: '1' };
  const result = instance.keyExtractor(item);
  expect(result).toEqual(item.id);
});
it('should call ref', () => {
  createComponent(false, mockPerson);
  const ref = 'test';
  instance.ref(ref);
  expect(instance.list).toEqual(ref);
});
