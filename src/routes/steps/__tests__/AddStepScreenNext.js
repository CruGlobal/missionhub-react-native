import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { RESET_STEP_COUNT, STEP_NOTE } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import { paramsforStageNavigation } from '../utils';
import { navigatePush } from '../../../actions/navigation';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { STAGE_SCREEN } from '../../../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../utils');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');

const myId = '111';
const otherId = '222';
const myName = 'Me';
const otherName = 'Other';
const stepId = '11';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const reverseContactAssignment = {
  id: contactAssignmentId,
};

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: 0 } } },
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
