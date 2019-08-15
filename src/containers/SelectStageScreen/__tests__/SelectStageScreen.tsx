/* eslint max-lines: 0 */
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { getStages } from '../../../actions/stages';
import { trackAction, trackState } from '../../../actions/analytics';
import {
  selectMyStage,
  selectPersonStage,
  updateUserStage,
} from '../../../actions/selectStage';
import { buildTrackingObj } from '../../../utils/common';
import {
  ACTIONS,
  SELF_VIEWED_STAGE_CHANGED,
  PERSON_VIEWED_STAGE_CHANGED,
} from '../../../constants';

import SelectStageScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/stages');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/selectStage');
jest.mock('../../../components/common', () => ({
  Text: 'Text',
  Button: 'Button',
}));
jest.mock('../../BackButton', () => 'BackButton');

const stages = [
  { id: 1, name: 'Stage 1', description: 'Stage 1 description' },
  { id: 2, name: 'Stage 2', description: 'Stage 2 description' },
  { id: 3, name: 'Stage 3', description: 'Stage 3 description' },
];

const section = 'section';
const subsection = 'subsection';
const myId = '111';
const myName = 'Me';
const assignedPersonId = '123';
const assignedPersonName = 'Person';
const unassignedPersonId = '321';
const unassignedPersonName = 'Nosrep';
const orgId = '222';
const contactAssignmentId = '1';

const contactAssignment = {
  id: contactAssignmentId,
  organization: { id: orgId },
  assigned_to: { id: myId },
};

const mePerson = {
  id: myId,
  first_name: myName,
  organizational_permissions: [{ organization_id: orgId }],
};
const assignedPerson = {
  id: assignedPersonId,
  first_name: assignedPersonName,
  organizational_permissions: [{ organization_id: orgId }],
  reverse_contact_assignments: [contactAssignment],
};
const unassignedPerson = {
  id: unassignedPersonId,
  first_name: unassignedPersonName,
  organizational_permissions: [{ organization_id: orgId }],
  reverse_contact_assignments: [],
};

const state = {
  auth: { person: { id: myId } },
  people: {
    allByOrg: {
      [orgId]: {
        id: orgId,
        people: {
          [myId]: mePerson,
          [assignedPersonId]: assignedPerson,
          [unassignedPersonId]: unassignedPerson,
        },
      },
    },
  },
  stages: { stages },
};

const baseParams = {
  section,
  subsection,
  personId: assignedPersonId,
  orgId,
};

const next = jest.fn();

const trackActionResult = { type: 'track action' };
const trackStateResult = { type: 'track state' };
const getStagesResult = { type: 'get stages' };
const selectMyStageResult = { type: 'select my stage' };
const selectPersonStageResult = { type: 'select person stage' };
const updateUserStageResult = { type: 'update user stage' };
const nextResult = { type: 'next' };

beforeEach(() => {
  (trackAction as jest.Mock).mockReturnValue(trackActionResult);
  (trackState as jest.Mock).mockReturnValue(trackStateResult);
  (getStages as jest.Mock).mockReturnValue(getStagesResult);
  (selectMyStage as jest.Mock).mockReturnValue(selectMyStageResult);
  (selectPersonStage as jest.Mock).mockReturnValue(selectPersonStageResult);
  (updateUserStage as jest.Mock).mockReturnValue(updateUserStageResult);
  (next as jest.Mock).mockReturnValue(nextResult);
});

describe('renders', () => {
  it('renders correctly without stages', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: {
        ...state,
        stages: {},
      },
      navParams: baseParams,
    }).snapshot();
  });

  it('renders correctly without back button', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: {
        ...baseParams,
        enableBackButton: false,
      },
    }).snapshot();
  });

  it('renders correctly with question text', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: {
        ...baseParams,
        questionText: 'Question?',
      },
    }).snapshot();
  });
});

describe('renders for me', () => {
  const myNavParams = {
    ...baseParams,
    personId: myId,
  };

  it('renders correctly', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: myNavParams,
    }).snapshot();
  });

  it('renders firstItem correctly', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: { ...myNavParams, selectedStageId: 1 },
    }).snapshot();
  });
});

describe('renders for other', () => {
  const otherNavParams = {
    ...baseParams,
    personId: assignedPersonId,
  };

  it('renders correctly', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: otherNavParams,
    }).snapshot();
  });

  it('renders firstItem correctly', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: { ...otherNavParams, selectedStageId: 1 },
    }).snapshot();
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildAndTestMount = async (navParams: any) => {
  const startIndex = navParams.selectedStageId || 0;
  const snapTracking = buildTrackingObj(
    `${section} : ${subsection} : stage : ${stages[startIndex].id}`,
    section,
    subsection,
    'stage',
  );

  const { store, getAllByTestId } = renderWithContext(
    <SelectStageScreen next={next} />,
    {
      initialState: state,
      navParams,
    },
  );

  await flushMicrotasksQueue();

  expect(getStages).toHaveBeenCalledWith();
  expect(trackState).toHaveBeenCalledWith(snapTracking);

  return { store, getAllByTestId, snapTracking };
};

describe('actions on mount', () => {
  const stageId = 1;

  describe('for me', () => {
    it('gets stages and snaps to first item on mount', async () => {
      const { store, snapTracking } = await buildAndTestMount({
        ...baseParams,
        personId: myId,
        selectedStageId: stageId,
      });

      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: SELF_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
      ]);
    });
  });

  describe('for other', () => {
    it('gets stages and snaps to first item on mount', async () => {
      const { store, snapTracking } = await buildAndTestMount({
        ...baseParams,
        personId: assignedPersonId,
        selectedStageId: stageId,
      });

      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: PERSON_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
      ]);
    });
  });
});

describe('setStage', () => {
  const selectedStageId = 1;
  const stage = stages[selectedStageId];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let selectAction: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildAndTestSelect = async (navParams: any, nextProps: any) => {
    const { store, getAllByTestId, snapTracking } = await buildAndTestMount(
      navParams,
    );

    await fireEvent.press(getAllByTestId('stageSelectButton')[selectedStageId]);

    expect(next).toHaveBeenCalledWith(nextProps);
    expect(trackAction).toHaveBeenCalledWith(selectAction.name, {
      [selectAction.key]: stage.id,
      [ACTIONS.STAGE_SELECTED.key]: null,
    });

    return { store, snapTracking };
  };

  describe('for me', () => {
    beforeEach(() => {
      selectAction = ACTIONS.SELF_STAGE_SELECTED;
    });

    it('selects new stage', async () => {
      const navParams = {
        ...baseParams,
        personId: myId,
      };
      const nextProps = {
        stage,
        firstName: myName,
        personId: myId,
        contactAssignmentId: undefined,
        orgId,
        isAlreadySelected: false,
        isMe: true,
      };

      const { store, snapTracking } = await buildAndTestSelect(
        navParams,
        nextProps,
      );

      expect(selectMyStage).toHaveBeenCalledWith(stage.id);
      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: SELF_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
        selectMyStageResult,
        nextResult,
        trackActionResult,
      ]);
    });

    it('selects already selected stage', async () => {
      const navParams = {
        ...baseParams,
        personId: myId,
        selectedStageId,
      };
      const nextProps = {
        stage,
        firstName: myName,
        personId: myId,
        contactAssignmentId: undefined,
        orgId,
        isAlreadySelected: true,
        isMe: true,
      };

      const { store, snapTracking } = await buildAndTestSelect(
        navParams,
        nextProps,
      );

      expect(selectMyStage).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: SELF_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
        nextResult,
        trackActionResult,
      ]);
    });
  });

  describe('for other assigned to me', () => {
    beforeEach(() => {
      selectAction = ACTIONS.PERSON_STAGE_SELECTED;
    });

    it('selects new stage', async () => {
      const navParams = {
        ...baseParams,
        personId: assignedPersonId,
      };
      const nextProps = {
        stage,
        firstName: assignedPersonName,
        personId: assignedPersonId,
        contactAssignmentId,
        orgId,
        isAlreadySelected: false,
        isMe: false,
      };

      const { store, snapTracking } = await buildAndTestSelect(
        navParams,
        nextProps,
      );

      expect(updateUserStage).toHaveBeenCalledWith(
        contactAssignmentId,
        stage.id,
      );
      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: PERSON_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
        updateUserStageResult,
        nextResult,
        trackActionResult,
      ]);
    });

    it('selects already selected stage', async () => {
      const navParams = {
        ...baseParams,
        personId: assignedPersonId,
        selectedStageId,
      };
      const nextProps = {
        stage,
        firstName: assignedPersonName,
        personId: assignedPersonId,
        contactAssignmentId,
        orgId,
        isAlreadySelected: true,
        isMe: false,
      };

      const { store, snapTracking } = await buildAndTestSelect(
        navParams,
        nextProps,
      );

      expect(updateUserStage).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: PERSON_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
        nextResult,
        trackActionResult,
      ]);
    });
  });

  describe('for other not assigned to me', () => {
    beforeEach(() => {
      selectAction = ACTIONS.PERSON_STAGE_SELECTED;
    });

    it('selects new stage', async () => {
      const navParams = {
        ...baseParams,
        personId: unassignedPersonId,
      };
      const nextProps = {
        stage,
        firstName: unassignedPersonName,
        personId: unassignedPersonId,
        contactAssignmentId: undefined,
        orgId,
        isAlreadySelected: false,
        isMe: false,
      };

      const { store, snapTracking } = await buildAndTestSelect(
        navParams,
        nextProps,
      );

      expect(selectPersonStage).toHaveBeenCalledWith(
        unassignedPersonId,
        myId,
        stage.id,
        orgId,
      );
      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: PERSON_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
        selectPersonStageResult,
        nextResult,
        trackActionResult,
      ]);
    });

    it('selects already selected stage', async () => {
      const navParams = {
        ...baseParams,
        personId: unassignedPersonId,
        selectedStageId,
      };
      const nextProps = {
        stage,
        firstName: unassignedPersonName,
        personId: unassignedPersonId,
        contactAssignmentId: undefined,
        orgId,
        isAlreadySelected: true,
        isMe: false,
      };

      const { store, snapTracking } = await buildAndTestSelect(
        navParams,
        nextProps,
      );

      expect(selectPersonStage).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        getStagesResult,
        {
          type: PERSON_VIEWED_STAGE_CHANGED,
          newActiveTab: snapTracking,
        },
        trackStateResult,
        nextResult,
        trackActionResult,
      ]);
    });
  });
});
