import i18next from 'i18next';

import { paramsForStageNavigation } from '../';
import { personSelector } from '../../../selectors/people';
import { apolloClient } from '../../../apolloClient';

jest.mock('../../../selectors/people');
jest.mock('../../../apolloClient', () => ({
  apolloClient: {
    query: jest.fn(),
  },
}));

const myId = '111';
const otherId = '222';
const myName = 'Me';
const otherName = 'Other';
const orgId = '11';
const stageId = '0';
const notSureStageId = '1';
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
  people: { people: { [otherId]: otherPerson } },
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
  // @ts-ignore
  personSelector.mockReturnValue(otherPerson);
  getState.mockReturnValue(baseState);
  (apolloClient.query as jest.Mock).mockReturnValue({
    data: {
      person: { steps: { pageInfo: { totalCount: 1 } } },
    },
  });
});

describe('is Me, not "Not Sure" stage, step count not complete', () => {
  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      hasHitCount: false,
      isNotSure: false,
      firstItemIndex: 0,
      questionText: i18next.t('selectStage:completed3StepsMe'),
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

  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      hasHitCount: false,
      isNotSure: true,
      firstItemIndex: 1,
      questionText: i18next.t('selectStage:meQuestion', {
        name: myName,
      }),
    });
  });
});

describe('is Me, not "Not Sure" stage, step count complete', () => {
  it('returns correct params', async () => {
    (apolloClient.query as jest.Mock).mockReturnValue({
      data: {
        person: { steps: { pageInfo: { totalCount: 3 } } },
      },
    });

    const result = await paramsForStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      hasHitCount: true,
      isNotSure: false,
      firstItemIndex: 0,
      questionText: i18next.t('selectStage:completed3StepsMe'),
    });
  });
});

describe('is not Me, not "Not Sure" stage, step count not complete', () => {
  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(otherId, orgId, getState);

    expect(result).toEqual({
      hasHitCount: false,
      isNotSure: false,
      firstItemIndex: 0,
      questionText: i18next.t('selectStage:completed3Steps', {
        name: otherName,
      }),
    });
  });
});

describe('is not Me, "Not Sure" stage, step count not complete', () => {
  beforeEach(() => {
    const newState = {
      ...baseState,
      people: {
        people: { [otherId]: otherPersonNotSure },
      },
    };
    // @ts-ignore
    personSelector.mockReturnValue(otherPersonNotSure);
    getState.mockReturnValue(newState);
  });

  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(otherId, orgId, getState);

    expect(result).toEqual({
      hasHitCount: false,
      isNotSure: true,
      firstItemIndex: 1,
      questionText: i18next.t('selectStage:completed1Step', {
        name: otherName,
      }),
    });
  });
});

describe('is not Me, not "Not Sure" stage, step count complete', () => {
  it('returns correct params', async () => {
    (apolloClient.query as jest.Mock).mockReturnValue({
      data: {
        person: { steps: { pageInfo: { totalCount: 3 } } },
      },
    });

    const result = await paramsForStageNavigation(otherId, orgId, getState);

    expect(result).toEqual({
      hasHitCount: true,
      isNotSure: false,
      firstItemIndex: 0,
      questionText: i18next.t('selectStage:completed3Steps', {
        name: otherName,
      }),
    });
  });
});
