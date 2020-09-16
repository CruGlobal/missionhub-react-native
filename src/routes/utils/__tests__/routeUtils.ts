import i18next from 'i18next';

import { paramsForStageNavigation } from '../';
import { apolloClient } from '../../../apolloClient';
import { getAuthPerson } from '../../../auth/authUtilities';

jest.mock('../../../apolloClient', () => ({
  apolloClient: {
    query: jest.fn(),
  },
}));
jest.mock('../../../auth/authUtilities');

const myId = '111';
const otherId = '222';
const myName = 'Me Fname';
const otherName = 'Other';
const orgId = '11';
const stageId = '0';
const notSureStageId = '6';
const assignmentId = '33';

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
  people: { people: { [otherId]: otherPerson } },
  stages: {
    stages: [{ id: stageId }, { id: notSureStageId }],
  },
  steps: { userStepCount: { [myId]: 1, [otherId]: 1 } },
};

const getState = jest.fn();

beforeEach(() => {
  getState.mockReturnValue(baseState);
  (apolloClient.query as jest.Mock).mockReturnValue({
    data: {
      person: { steps: { pageInfo: { totalCount: 1 } } },
    },
  });
  (getAuthPerson as jest.Mock).mockReturnValue({
    id: myId,
    stage: { id: stageId },
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
  it('returns correct params', async () => {
    (getAuthPerson as jest.Mock).mockReturnValue({
      id: myId,
      firstName: myName,
      stage: { id: notSureStageId },
    });
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
