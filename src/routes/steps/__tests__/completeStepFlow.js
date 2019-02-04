import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { RESET_STEP_COUNT, STEP_NOTE } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { buildTrackingObj } from '../../../utils/common';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { STAGE_SCREEN } from '../../../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { paramsforStageNavigation } from '../utils';

jest.mock('../utils');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/journey');
jest.mock('../../../selectors/people');

const myId = '111';
const otherId = '222';
const myName = 'Me';
const otherName = 'Other';
const stepId = '11';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const stage = { id: 1 };
const reverseContactAssignment = {
  id: contactAssignmentId,
};

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: 0 } } },
  personProfile: { id: '1', personFirstName: otherName },
  profile: { id: '2', firstName: myName },
});

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = CompleteStepFlowScreens[screen];

  await store.dispatch(
    renderShallow(
      <Component
        navigation={{
          state: {
            params: navParams,
          },
        }}
      />,
      store,
    )
      .instance()
      .props.next(nextProps),
  );
};

const navigatePushResponse = { type: 'navigate push' };

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('AddStepScreen, isMe, stage is not "Not Sure", has not completed 3 steps', () => {
  beforeEach(() => {
    paramsforStageNavigation.mockReturnValue({
      isMe: true,
      hasHitCount: false,
      isNotSure: false,
      subsection: 'self',
      firstItemIndex: 0,
      questionText,
      assignment: null,
      name: myName,
    });
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      { stepId, personId: myId, orgId, type: STEP_NOTE },
      { personId: myId, orgId },
    );

    expect(paramsforStageNavigation).toHaveBeenCalledWith(
      myId,
      orgId,
      store.getState,
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      contactId: myId,
      orgId,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('AddStepScreen, isMe, stage is "Not Sure"', () => {
  beforeEach(() => {
    paramsforStageNavigation.mockReturnValue({
      isMe: true,
      hasHitCount: false,
      isNotSure: true,
      subsection: 'self',
      firstItemIndex: 1,
      questionText,
      assignment: null,
      name: myName,
    });
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      { stepId, personId: myId, orgId, type: STEP_NOTE },
      { personId: myId, orgId },
    );

    expect(paramsforStageNavigation).toHaveBeenCalledWith(
      myId,
      orgId,
      store.getState,
    );
    expect(navigatePush).toHaveBeenCalledWith(STAGE_SCREEN, {
      section: 'people',
      subsection: 'self',
      firstItem: 1,
      enableBackButton: false,
      noNav: true,
      questionText,
      orgId,
      contactId: myId,
      contactAssignmentId: null,
      name: myName,
    });
    expect(store.getActions()).toEqual([
      { type: RESET_STEP_COUNT, userId: myId },
      navigatePushResponse,
    ]);
  });
});

describe('AddStepScreen, isMe, has completed 3 steps', () => {
  beforeEach(() => {
    paramsforStageNavigation.mockReturnValue({
      isMe: true,
      hasHitCount: true,
      isNotSure: false,
      subsection: 'self',
      firstItemIndex: 0,
      questionText,
      assignment: null,
      name: myName,
    });
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      { stepId, personId: myId, orgId, type: STEP_NOTE },
      { personId: myId, orgId },
    );

    expect(navigatePush).toHaveBeenCalledWith(STAGE_SCREEN, {
      section: 'people',
      subsection: 'self',
      firstItem: 0,
      enableBackButton: false,
      noNav: true,
      questionText,
      orgId,
      contactId: myId,
      contactAssignmentId: null,
      name: myName,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('AddStepScreen, not isMe, stage is not "Not Sure", has not completed 3 steps', () => {
  beforeEach(() => {
    paramsforStageNavigation.mockReturnValue({
      isMe: false,
      hasHitCount: false,
      isNotSure: false,
      subsection: 'person',
      firstItemIndex: 0,
      questionText,
      assignment: reverseContactAssignment,
      name: otherName,
    });
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      { stepId, personId: otherId, orgId, type: STEP_NOTE },
      { personId: otherId, orgId },
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      contactId: otherId,
      orgId,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('AddStepScreen, not isMe, stage is "Not Sure"', () => {
  beforeEach(() => {
    paramsforStageNavigation.mockReturnValue({
      isMe: false,
      hasHitCount: false,
      isNotSure: true,
      subsection: 'person',
      firstItemIndex: 1,
      questionText,
      assignment: reverseContactAssignment,
      name: otherName,
    });
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      { stepId, personId: otherId, orgId, type: STEP_NOTE },
      { personId: otherId, orgId },
    );

    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      section: 'people',
      subsection: 'person',
      firstItem: 1,
      enableBackButton: false,
      noNav: true,
      questionText,
      orgId,
      contactId: otherId,
      contactAssignmentId,
      name: otherName,
    });
    expect(store.getActions()).toEqual([
      { type: RESET_STEP_COUNT, userId: otherId },
      navigatePushResponse,
    ]);
  });
});

describe('AddStepScreen, not isMe, has completed 3 steps', () => {
  beforeEach(() => {
    paramsforStageNavigation.mockReturnValue({
      isMe: false,
      hasHitCount: true,
      isNotSure: false,
      subsection: 'person',
      firstItemIndex: 0,
      questionText,
      assignment: reverseContactAssignment,
      name: otherName,
    });
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      { stepId, personId: otherId, orgId, type: STEP_NOTE },
      { personId: otherId, orgId },
    );

    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      section: 'people',
      subsection: 'person',
      firstItem: 0,
      enableBackButton: false,
      noNav: true,
      questionText,
      orgId,
      contactId: otherId,
      contactAssignmentId,
      name: otherName,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('StageScreen, isAlreadySelected', () => {
  it('should fire required next actions', async () => {
    await buildAndCallNext(
      STAGE_SCREEN,
      {
        section: 'people',
        subsection: 'self',
        firstItem: 0,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: myId,
      },
      { stage, contactId: myId, orgId, isAlreadySelected: true },
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      contactId: myId,
      orgId,
    });
  });
});

describe('StageScreen, not isAlreadySelected', () => {
  it('should fire required next actions', async () => {
    await buildAndCallNext(
      STAGE_SCREEN,
      {
        section: 'people',
        subsection: 'self',
        firstItem: 0,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: myId,
      },
      { stage, contactId: myId, orgId, isAlreadySelected: false },
    );

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
      contactId: myId,
      enableBackButton: true,
      contactStage: stage,
      organization: { id: orgId },
    });
  });
});

describe('PersonStageScreen, isAlreadySelected', () => {
  it('should fire required next actions', async () => {
    await buildAndCallNext(
      PERSON_STAGE_SCREEN,
      {
        section: 'people',
        subsection: 'person',
        firstItem: 0,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: otherId,
        contactAssignmentId,
        name: otherName,
      },
      {
        stage,
        contactId: otherId,
        name: otherName,
        orgId,
        isAlreadySelected: true,
      },
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      contactId: otherId,
      orgId,
    });
  });
});

describe('PersonStageScreen, not isAlreadySelected', () => {
  it('should fire required next actions', async () => {
    await buildAndCallNext(
      PERSON_STAGE_SCREEN,
      {
        section: 'people',
        subsection: 'person',
        firstItem: 0,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: otherId,
        contactAssignmentId,
        name: otherName,
      },
      {
        stage,
        contactId: otherId,
        name: otherName,
        orgId,
        isAlreadySelected: false,
      },
    );

    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      contactStage: stage,
      contactId: otherId,
      organization: { id: orgId },
      contactName: otherName,
      createStepTracking: buildTrackingObj(
        'people : person : steps : create',
        'people',
        'person',
        'steps',
      ),
    });
  });
});

describe('SelectMyStepScreen next', () => {
  it('should fire required next actions', async () => {
    await buildAndCallNext(
      SELECT_MY_STEP_SCREEN,
      {
        enableBackButton: true,
        contactStage: stage,
        organization: { id: orgId },
      },
      {},
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {});
  });
});

describe('PersonSelectStepScreen next', () => {
  it('should fire required next actions', async () => {
    await buildAndCallNext(
      PERSON_SELECT_STEP_SCREEN,
      {
        contactStage: stage,
        contactId: otherId,
        organization: { id: orgId },
        contactName: otherName,
        createStepTracking: buildTrackingObj(
          'people : person : steps : create',
          'people',
          'person',
          'steps',
        ),
      },
      {},
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {});
  });
});

describe('CelebrationScreen next', () => {
  const reloadJourneyResponse = { type: 'reload journey' };
  const popToTopResponse = { type: 'pop to top of stack' };
  const navigateBackResponse = { type: 'navigate back' };

  beforeEach(() => {
    reactNavigation.StackActions.popToTop = jest
      .fn()
      .mockReturnValue(popToTopResponse);
    navigateBack.mockReturnValue(navigateBackResponse);
    reloadJourney.mockReturnValue(reloadJourneyResponse);
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      CELEBRATION_SCREEN,
      { contactId: myId, orgId },
      { contactId: myId, orgId },
    );

    expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
    expect(navigateBack).toHaveBeenCalledTimes(1);
  });
});
