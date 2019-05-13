import i18next from 'i18next';

import { paramsForStageNavigation } from '../index';
import { personSelector } from '../../../selectors/people';

jest.mock('../../../../selectors/people');

const myId = '111';
const otherId = '222';
const myName = 'Me';
const otherName = 'Other';
const orgId = '11';
const stageId = 0;
const notSureStageId = 1;
const assignmentId = '33';

const myPerson = {
  id: myId,
  first_name: myName,
  user: { pathway_stage_id: stageId },
};
const myPersonNotSure = {
  ...myPerson,
  user: { pathway_stage_id: notSureStageId },
};

const reverseAssignment = {
  id: assignmentId,
  organization: { id: orgId },
  pathway_stage_id: stageId,
  assigned_to: { id: myId },
};
const reverseAssignmentNotSure = {
  ...reverseAssignment,
  pathway_stage_id: notSureStageId,
};

const otherPerson = {
  id: otherId,
  first_name: otherName,
  reverse_contact_assignments: [reverseAssignment],
};
const otherPersonNotSure = {
  ...otherPerson,
  reverse_contact_assignments: [reverseAssignmentNotSure],
};

const baseState = {
  auth: { person: myPerson },
  people: { allByOrg: [{ id: orgId, people: { [otherId]: otherPerson } }] },
  stages: {
    stages: [{ id: stageId }, { id: notSureStageId }],
    stagesObj: {
      [stageId]: { id: stageId },
      [notSureStageId]: { id: notSureStageId, name_i18n: 'notsure_name' },
    },
  },
  steps: { userStepCount: { [myId]: 1, [otherId]: 1 } },
};

const getState = jest.fn();

beforeEach(() => {
  personSelector.mockReturnValue(otherPerson);
  getState.mockReturnValue(baseState);
});

describe('is Me, not "Not Sure" stage, step count not complete', () => {
  it('returns correct params', () => {
    const result = paramsforStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      isMe: true,
      hasHitCount: false,
      isNotSure: false,
      subsection: 'self',
      firstItemIndex: stageId,
      questionText: i18next.t('selectStage:completed3StepsMe'),
      assignment: null,
      name: myName,
    });
  });
});

describe('is Me, "Not Sure" stage, step count not complete', () => {
  beforeEach(() => {
    const newState = {
      ...baseState,
      auth: {
        ...baseState.auth,
        person: myPersonNotSure,
      },
    };
    getState.mockReturnValue(newState);
  });

  it('returns correct params', () => {
    const result = paramsforStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      isMe: true,
      hasHitCount: false,
      isNotSure: true,
      subsection: 'self',
      firstItemIndex: notSureStageId,
      questionText: i18next.t('selectStage:meQuestion', {
        name: myName,
      }),
      assignment: null,
      name: myName,
    });
  });
});

describe('is Me, not "Not Sure" stage, step count complete', () => {
  beforeEach(() => {
    const newState = {
      ...baseState,
      steps: {
        userStepCount: {
          ...baseState.steps.userStepCount,
          [myId]: 3,
        },
      },
    };
    getState.mockReturnValue(newState);
  });

  it('returns correct params', () => {
    const result = paramsforStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      isMe: true,
      hasHitCount: true,
      isNotSure: false,
      subsection: 'self',
      firstItemIndex: stageId,
      questionText: i18next.t('selectStage:completed3StepsMe'),
      assignment: null,
      name: myName,
    });
  });
});

describe('is not Me, not "Not Sure" stage, step count not complete', () => {
  it('returns correct params', () => {
    const result = paramsforStageNavigation(otherId, orgId, getState);

    expect(result).toEqual({
      isMe: false,
      hasHitCount: false,
      isNotSure: false,
      subsection: 'person',
      firstItemIndex: stageId,
      questionText: i18next.t('selectStage:completed3Steps', {
        name: otherName,
      }),
      assignment: reverseAssignment,
      name: otherName,
    });
  });
});

describe('is not Me, "Not Sure" stage, step count not complete', () => {
  beforeEach(() => {
    const newState = {
      ...baseState,
      people: {
        allByOrg: [{ id: orgId, people: { [otherId]: otherPersonNotSure } }],
      },
    };
    personSelector.mockReturnValue(otherPersonNotSure);
    getState.mockReturnValue(newState);
  });

  it('returns correct params', () => {
    const result = paramsforStageNavigation(otherId, orgId, getState);

    expect(result).toEqual({
      isMe: false,
      hasHitCount: false,
      isNotSure: true,
      subsection: 'person',
      firstItemIndex: notSureStageId,
      questionText: i18next.t('selectStage:completed1Step', {
        name: otherName,
      }),
      assignment: reverseAssignmentNotSure,
      name: otherName,
    });
  });
});

describe('is not Me, not "Not Sure" stage, step count complete', () => {
  beforeEach(() => {
    const newState = {
      ...baseState,
      steps: {
        userStepCount: {
          ...baseState.steps.userStepCount,
          [otherId]: 3,
        },
      },
    };
    getState.mockReturnValue(newState);
  });

  it('returns correct params', () => {
    const result = paramsforStageNavigation(otherId, orgId, getState);

    expect(result).toEqual({
      isMe: false,
      hasHitCount: true,
      isNotSure: false,
      subsection: 'person',
      firstItemIndex: stageId,
      questionText: i18next.t('selectStage:completed3Steps', {
        name: otherName,
      }),
      assignment: reverseAssignment,
      name: otherName,
    });
  });
});
