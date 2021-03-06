/* eslint-disable max-lines */

import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { getStages } from '../../../actions/stages';
import {
  trackAction,
  updateAnalyticsContext,
} from '../../../actions/analytics';
import { updatePersonGQL } from '../../../actions/person';
import {
  selectMyStage,
  selectPersonStage,
  updateUserStage,
} from '../../../actions/selectStage';
import { Stage } from '../../../reducers/stages';
import { ACTIONS } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import SelectStageScreen, { SelectStageNavParams } from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/stages');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/selectStage');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../components/common', () => ({
  Text: 'Text',
  Button: 'Button',
}));
jest.mock('../../DeprecatedBackButton', () => 'DeprecatedBackButton');
jest.mock('../../../components/Header', () => 'Header');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const baseStage: Stage = {
  id: '1',
  name: 'stage',
  description: 'description',
  self_followup_description: 'description',
  position: 1,
  icon_url: 'https://misisonhub.com',
  localized_pathway_stages: [],
};

const stages: Stage[] = [
  {
    ...baseStage,
    id: '1',
    name: 'Stage 1',
    description: 'Stage 1 description',
  },
  {
    ...baseStage,
    id: '2',
    name: 'Stage 2',
    description: 'Stage 2 description',
  },
  {
    ...baseStage,
    id: '3',
    name: 'Stage 3',
    description: 'Stage 3 description',
  },
];

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
  pathway_stage_id: '1',
};

const mePerson = {
  id: myId,
  first_name: myName,
  organizational_permissions: [{ organization_id: orgId }],
  user: {
    pathway_stage_id: '1',
  },
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
  people: {
    people: {
      [myId]: mePerson,
      [assignedPersonId]: assignedPerson,
      [unassignedPersonId]: unassignedPerson,
    },
  },
  stages: { stages },
  onboarding: { currentlyOnboarding: false },
};

const baseParams = {
  personId: assignedPersonId,
  orgId,
  enableBackButton: true,
};

const next = jest.fn();
const onComplete = jest.fn();
const handleScreenChange = jest.fn();

const trackActionResult = { type: 'track action' };
const updateAnalyticsContextResult = { type: 'updateAnalyticsContext' };
const getStagesResult = { type: 'get stages', response: stages };
const selectMyStageResult = { type: 'select my stage' };
const selectPersonStageResult = { type: 'select person stage' };
const updateUserStageResult = { type: 'update user stage' };
const nextResult = { type: 'next' };

beforeEach(() => {
  (trackAction as jest.Mock).mockReturnValue(trackActionResult);
  (updateAnalyticsContext as jest.Mock).mockReturnValue(
    updateAnalyticsContextResult,
  );
  (getStages as jest.Mock).mockReturnValue(getStagesResult);
  (selectMyStage as jest.Mock).mockReturnValue(selectMyStageResult);
  (selectPersonStage as jest.Mock).mockReturnValue(selectPersonStageResult);
  (updateUserStage as jest.Mock).mockReturnValue(updateUserStageResult);
  (next as jest.Mock).mockReturnValue(nextResult);
  (useAnalytics as jest.Mock).mockReturnValue(handleScreenChange);
  (useAnalytics as jest.Mock).mockReturnValue(handleScreenChange);
});

describe('renders', () => {
  it('renders correctly without stages', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: {
        ...state,
        stages: { stages: [] },
      },
      navParams: baseParams,
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('', {
      triggerTracking: false,
    });
  });

  it('renders correctly without back button', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: {
        ...baseParams,
        enableBackButton: false,
      },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('', {
      triggerTracking: false,
    });
  });

  it('renders correctly with question text', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: {
        ...baseParams,
        questionText: 'Question?',
      },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('', {
      triggerTracking: false,
    });
  });
});

describe('renders for me', () => {
  const myNavParams = {
    ...baseParams,
    personId: myId,
  };

  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: myNavParams,
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    });

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('', {
      triggerTracking: false,
    });

    expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 1']);
  });

  it('renders firstItem correctly', async () => {
    const { snapshot } = renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: { ...myNavParams, selectedStageId: 1 },
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    });

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('', {
      triggerTracking: false,
    });

    expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 2']);
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

    expect(useAnalytics).toHaveBeenCalledWith('', {
      triggerTracking: false,
    });

    expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 1']);
  });

  it('renders firstItem correctly', () => {
    renderWithContext(<SelectStageScreen next={next} />, {
      initialState: state,
      navParams: { ...otherNavParams, selectedStageId: 1 },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('', {
      triggerTracking: false,
    });

    expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 2']);
  });
});

const buildAndTestMount = async (
  initialState: typeof state,
  navParams: SelectStageNavParams,
) => {
  const { store, getAllByTestId } = renderWithContext(
    <SelectStageScreen next={next} />,
    {
      initialState,
      navParams,
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    },
  );

  await flushMicrotasksQueue();

  return { store, getAllByTestId };
};

describe('actions on mount', () => {
  const stageId = 0;

  describe('for me', () => {
    it('gets stages and snaps to first item on mount', async () => {
      const { store } = await buildAndTestMount(
        {
          ...state,
          stages: { stages: [] },
        },
        {
          ...baseParams,
          personId: myId,
          selectedStageId: stageId,
        },
      );

      expect(getStages).toHaveBeenCalledWith();
      expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 1']);
      expect(store.getActions()).toEqual([getStagesResult]);
    });

    it('gets stages and snaps to first item on mount in onboarding', async () => {
      const { store } = await buildAndTestMount(
        {
          ...state,
          stages: { stages: [] },
          onboarding: { currentlyOnboarding: true },
        },
        {
          ...baseParams,
          personId: myId,
          selectedStageId: stageId,
        },
      );

      expect(getStages).toHaveBeenCalledWith();
      expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 1']);
      expect(store.getActions()).toEqual([getStagesResult]);
    });
  });

  describe('for other', () => {
    it('gets stages and snaps to first item on mount', async () => {
      const { store } = await buildAndTestMount(
        {
          ...state,
          stages: { stages: [] },
        },
        {
          ...baseParams,
          personId: assignedPersonId,
          selectedStageId: stageId,
        },
      );

      expect(getStages).toHaveBeenCalledWith();
      expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 1']);
      expect(store.getActions()).toEqual([getStagesResult]);
    });
  });

  describe('stages are in Redux', () => {
    it('snaps to first item on mount without getting stages', async () => {
      const { store } = await buildAndTestMount(state, {
        ...baseParams,
        personId: myId,
        selectedStageId: stageId,
      });

      expect(getStages).not.toHaveBeenCalled();
      expect(handleScreenChange).toHaveBeenCalledWith(['stage', 'stage 1']);
      expect(store.getActions()).toEqual([]);
    });
  });
});

describe('setStage', () => {
  const selectedStageId = 0;
  const stage = stages[selectedStageId];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let selectAction: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildAndTestSelect = async (navParams: any, nextProps: any) => {
    const { store, getAllByTestId } = await buildAndTestMount(state, navParams);

    await fireEvent.press(getAllByTestId('stageSelectButton')[selectedStageId]);

    expect(next).toHaveBeenCalledWith(nextProps);
    expect(trackAction).toHaveBeenCalledWith(selectAction.name, {
      [selectAction.key]: stage.id,
      [ACTIONS.STAGE_SELECTED.key]: null,
    });

    return { store };
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
        isAlreadySelected: false,
        isMe: true,
        personId: myId,
        stage: stage,
        orgId,
      };

      const { store } = await buildAndTestSelect(navParams, nextProps);

      expect(selectMyStage).toHaveBeenCalledWith(stage.id);
      expect(updatePersonGQL).toHaveBeenCalledWith(myId);
      expect(store.getActions()).toEqual([
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
        isAlreadySelected: true,
        isMe: true,
        personId: myId,
        stage: stage,
        orgId,
      };

      const { store } = await buildAndTestSelect(navParams, nextProps);

      expect(selectMyStage).not.toHaveBeenCalled();
      expect(updatePersonGQL).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([nextResult, trackActionResult]);
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
        isAlreadySelected: false,
        isMe: false,
        personId: assignedPersonId,
        stage: stage,
        orgId,
      };

      const { store } = await buildAndTestSelect(navParams, nextProps);

      expect(updateUserStage).toHaveBeenCalledWith(
        contactAssignmentId,
        stage.id,
      );
      expect(updatePersonGQL).toHaveBeenCalledWith(assignedPersonId);
      expect(store.getActions()).toEqual([
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
        isAlreadySelected: true,
        isMe: false,
        personId: assignedPersonId,
        stage: stage,
        orgId,
      };

      const { store } = await buildAndTestSelect(navParams, nextProps);

      expect(updateUserStage).not.toHaveBeenCalled();
      expect(updatePersonGQL).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([nextResult, trackActionResult]);
    });

    it('selects already selected stage with skip select steps', async () => {
      const navParams = {
        ...baseParams,
        personId: assignedPersonId,
        selectedStageId,
        skipSelectSteps: true,
      };
      const nextProps = {
        isAlreadySelected: true,
        skipSelectSteps: true,
        isMe: false,
        personId: assignedPersonId,
        stage: stage,
        orgId,
      };

      const { store } = await buildAndTestSelect(navParams, nextProps);

      expect(updateUserStage).not.toHaveBeenCalled();
      expect(updatePersonGQL).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([nextResult, trackActionResult]);
    });

    it('selects new stage for edit screen', async () => {
      const navParams = {
        ...baseParams,
        personId: assignedPersonId,
        onComplete,
      };
      const { store, getAllByTestId } = await buildAndTestMount(
        state,
        navParams,
      );

      await fireEvent.press(
        getAllByTestId('stageSelectButton')[selectedStageId],
      );

      expect(next).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith(stages[selectedStageId]);
      expect(trackAction).toHaveBeenCalledWith(selectAction.name, {
        [selectAction.key]: stage.id,
        [ACTIONS.STAGE_SELECTED.key]: null,
      });

      expect(updateUserStage).toHaveBeenCalled();
      expect(updatePersonGQL).toHaveBeenCalledWith(assignedPersonId);
      expect(store.getActions()).toEqual([
        updateUserStageResult,
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
        isAlreadySelected: false,
        isMe: false,
        personId: unassignedPersonId,
        stage: stage,
        orgId,
      };

      const { store } = await buildAndTestSelect(navParams, nextProps);

      expect(selectPersonStage).toHaveBeenCalledWith(
        unassignedPersonId,
        myId,
        stage.id,
        orgId,
      );
      expect(updatePersonGQL).toHaveBeenCalledWith(unassignedPersonId);
      expect(store.getActions()).toEqual([
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
        isAlreadySelected: true,
        isMe: false,
        personId: unassignedPersonId,
        stage: stage,
        orgId,
      };

      const { store } = await buildAndTestSelect(navParams, nextProps);

      expect(selectPersonStage).not.toHaveBeenCalled();
      expect(updatePersonGQL).not.toHaveBeenCalled();
      expect(store.getActions()).toEqual([nextResult, trackActionResult]);
    });
  });
});
