/* eslint max-lines: 0 */

import 'react-native';
import React from 'react';

import ContactSteps from '..';

import {
  createThunkStore,
  createMockNavState,
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { buildTrackingObj } from '../../../utils/common';
import {
  getContactSteps,
  completeStep,
  deleteStepWithTracking,
} from '../../../actions/steps';
import { contactAssignmentSelector } from '../../../selectors/people';
import { assignContactAndPickStage } from '../../../actions/misc';
import { promptToAssign } from '../../../utils/promptToAssign';
import { navigateToStageScreen } from '../../../actions/misc';
import {
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../../../routes/constants';
import { reloadJourney } from '../../../actions/journey';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/misc');
jest.mock('../../../utils/promptToAssign');
jest.mock('../../../actions/swipe');
jest.mock('../../../actions/journey');

const steps = [{ id: '1', title: 'Test Step' }];
const completedSteps = [{ id: '1', title: 'Test Step', completed_at: 'time' }];

const myId = '123';
const mockState = {
  steps: {
    mine: [],
    contactSteps: {
      '1-personal': { steps, completedSteps: [] },
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
const mockStateCompleted = {
  steps: {
    mine: [],
    contactSteps: {
      '1-personal': { steps, completedSteps },
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
const mockOrg = { id: '1111', user_created: true };
const mockContactAssignment = {
  id: 333,
};
const trackingObj = buildTrackingObj(
  'people : person : steps : add',
  'people',
  'person',
  'steps',
);

getContactSteps.mockReturnValue(() => {
  response: steps;
});
navigatePush.mockReturnValue({ type: 'navigated push' });
navigateBack.mockReturnValue({ type: 'navigated back' });
navigateToStageScreen.mockReturnValue({ type: 'navigated to stage screen' });
completeStep.mockReturnValue({ type: 'completed step' });
reloadJourney.mockReturnValue({ type: 'reloaded journey' });
deleteStepWithTracking.mockReturnValue({ type: 'deleted step with tracking' });

const store = createThunkStore(mockState);
const navState = createMockNavState();

let props = { isMe: false, person: mockPerson };
let component;
let instance;

beforeEach(() => {
  component = renderShallow(
    <ContactSteps {...props} navigation={navState} />,
    store,
  );
  instance = component.instance();
});

it('renders correctly with no steps', () => {
  testSnapshotShallow(
    <ContactSteps {...props} navigation={navState} />,
    createThunkStore({
      ...mockState,
      steps: {
        ...mockState.steps,
        contactSteps: {},
      },
    }),
  );
});

it('renders correctly with steps', () => {
  testSnapshotShallow(<ContactSteps {...props} navigation={navState} />, store);
});

it('renders correctly with completed steps', () => {
  const component = renderShallow(
    <ContactSteps {...props} navigation={navState} />,
    createThunkStore(mockStateCompleted),
  );

  component
    .childAt(0)
    .childAt(1)
    .props()
    .onPress();
  component.update();

  expect(component).toMatchSnapshot();
});

describe('renderItem', () => {
  beforeAll(() => {
    props = {
      isMe: false,
      person: mockPerson,
    };
  });

  it('renders row', () => {
    expect(
      component
        .childAt(0)
        .childAt(0)
        .props()
        .renderItem({ item: steps[0] }),
    ).toMatchSnapshot();
  });
});

describe('getSteps', () => {
  describe('for personal ministry', () => {
    beforeAll(() => {
      props = {
        isMe: false,
        person: mockPerson,
      };
    });

    it('should get steps', () => {
      expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, undefined);
    });
  });

  describe('for organization', () => {
    beforeAll(() => {
      props = {
        isMe: false,
        person: mockPerson,
        organization: mockOrg,
      };
    });

    it('should get steps', () => {
      expect(getContactSteps).toHaveBeenCalledWith(mockPerson.id, mockOrg.id);
    });
  });
});

describe('handleComplete', () => {
  beforeAll(() => {
    props = {
      isMe: false,
      person: mockPerson,
    };
  });

  it('triggers complete step flow', async () => {
    await component
      .childAt(0)
      .childAt(0)
      .props()
      .renderItem({ item: steps[0] })
      .props.onComplete();

    expect(getContactSteps).toHaveBeenCalled();
  });
});

describe('handleCreateStep', () => {
  describe('for me', () => {
    beforeAll(() => {
      contactAssignmentSelector.mockReturnValue(null);

      props = {
        isMe: true,
        person: { ...mockPerson, id: myId },
      };
    });

    it('navigates to select my steps flow', () => {
      instance.handleCreateStep();

      expect(navigatePush).toHaveBeenCalledWith(ADD_MY_STEP_FLOW, {
        enableBackButton: true,
        trackingObj,
      });
    });
  });

  describe('for contact without stage', () => {
    beforeAll(() => {
      contactAssignmentSelector.mockReturnValue(mockContactAssignment);

      props = {
        isMe: false,
        person: mockPerson,
      };
    });

    it('navigates to select stage flow', () => {
      instance.handleCreateStep();

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        mockPerson,
        mockContactAssignment,
        undefined,
        null,
      );
    });
  });

  describe('for contact with stage', () => {
    beforeAll(() => {
      contactAssignmentSelector.mockReturnValue({
        ...mockContactAssignment,
        pathway_stage_id: '2',
      });

      props = {
        isMe: false,
        person: mockPerson,
      };
    });

    it('navigates to person steps flow', () => {
      instance.handleCreateStep();

      expect(navigatePush).toHaveBeenCalledWith(ADD_PERSON_STEP_FLOW, {
        contactName: mockPerson.first_name,
        contactId: mockPerson.id,
        contact: mockPerson,
        organization: undefined,
        createStepTracking: buildTrackingObj(
          'people : person : steps : create',
          'people',
          'person',
          'steps',
        ),
        trackingObj,
      });
    });
  });

  describe('for contact with stage', () => {
    beforeAll(() => {
      contactAssignmentSelector.mockReturnValue(null);
      promptToAssign.mockReturnValue(Promise.resolve(true));

      props = {
        isMe: false,
        person: mockPerson,
      };
    });

    it('assigns the contact to me with prompt', async () => {
      await instance.handleCreateStep();

      expect(assignContactAndPickStage).toHaveBeenCalledWith(
        mockPerson,
        undefined,
        myId,
      );
    });
  });

  describe('for contact with stage', () => {
    beforeAll(() => {
      contactAssignmentSelector.mockReturnValue(null);
      promptToAssign.mockReturnValue(Promise.resolve(true));

      props = {
        isMe: false,
        person: mockPerson,
        organization: mockOrg,
      };
    });
    it('assigns the contact to me without prompt', async () => {
      await instance.handleCreateStep();

      expect(assignContactAndPickStage).toHaveBeenCalledWith(
        mockPerson,
        mockOrg,
        myId,
      );
      expect(promptToAssign).not.toHaveBeenCalled();
    });
  });
});

describe('ref', () => {
  beforeAll(() => {
    props = {
      isMe: false,
      person: mockPerson,
    };
  });

  it('should call ref', () => {
    const ref = 'test';
    instance.ref(ref);
    expect(instance.list).toEqual(ref);
  });
});
