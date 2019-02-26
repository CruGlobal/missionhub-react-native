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
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../AcceptedStepDetailScreen';
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

getContactSteps.mockReturnValue({ response: steps });

const store = createMockStore(mockState);
const navState = createMockNavState();

let props = { isMe: false, person: mockPerson };

let component;
let instance;

beforeEach(() => {
  jest.clearAllMocks();
  component = renderShallow(
    <ContactSteps {...props} navigation={navState} />,
    store,
  );
  instance = component.instance();
});

it('renders correctly with no steps', () => {
  testSnapshotShallow(
    <ContactSteps {...props} navigation={createMockNavState()} />,
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
    <ContactSteps {...props} navigation={createMockNavState()} />,
    store,
  );
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

describe('handleSaveNewSteps', () => {
  beforeAll(() => {
    props = {
      isMe: false,
      person: mockPerson,
    };
  });

  it('saves new steps', async () => {
    await instance.handleSaveNewSteps();

    expect(getContactSteps).toHaveBeenCalled();
    expect(navigateBack).toHaveBeenCalled();
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

    it('navigates to select my steps', () => {
      instance.handleCreateStep();

      expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
        onSaveNewSteps: expect.any(Function),
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

    it('navigates to select stage', () => {
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

    it('navigates to person steps', () => {
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

describe('key extractor', () => {
  beforeAll(() => {
    props = {
      isMe: false,
      person: mockPerson,
    };
  });

  it('should call key extractor', () => {
    const item = { id: '1' };
    const result = instance.keyExtractor(item);
    expect(result).toEqual(item.id);
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
