import i18next from 'i18next';

import { paramsForStageNavigation } from '../';
import { createApolloMockClient } from '../../../../testUtils/apolloMockClient';
import apolloClientModule from '../../../apolloClient';

jest.mock('../../../apolloClient');

const myId = '111';
const otherId = '222';
const myName = 'Me';
const orgId = '11';
const stageId = 0;
const notSureStageId = 1;

const myPerson = {
  id: myId,
  first_name: myName,
  user: { pathway_stage_id: stageId },
};
const myPersonNotSure = {
  ...myPerson,
  user: { pathway_stage_id: notSureStageId },
};

const baseState = {
  auth: { person: myPerson },
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
  getState.mockReturnValue(baseState);
});

describe('is Me, not "Not Sure" stage, step count not complete', () => {
  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      isMe: true,
      hasHitCount: false,
      isNotSure: false,
      subsection: 'self',
      firstItemIndex: stageId,
      questionText: i18next.t('selectStage:completed3StepsMe'),
      contactAssignmentId: null,
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

    apolloClientModule.apolloClient = createApolloMockClient({
      Query: () => ({
        person: () => ({
          reverseContactAssignments: () => [
            {
              assignedTo: () => ({ id: myId }),
              organization: () => ({ id: orgId }),
              pathwayStage: () => ({ id: notSureStageId }),
            },
          ],
        }),
      }),
    });
  });

  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      isMe: true,
      hasHitCount: false,
      isNotSure: true,
      subsection: 'self',
      firstItemIndex: notSureStageId,
      questionText: i18next.t('selectStage:meQuestion', {
        name: myName,
      }),
      contactAssignmentId: null,
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

  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(myId, orgId, getState);

    expect(result).toEqual({
      isMe: true,
      hasHitCount: true,
      isNotSure: false,
      subsection: 'self',
      firstItemIndex: stageId,
      questionText: i18next.t('selectStage:completed3StepsMe'),
      contactAssignmentId: null,
      name: myName,
    });
  });
});

describe('is not Me, not "Not Sure" stage, step count not complete', () => {
  it('returns correct params', async () => {
    apolloClientModule.apolloClient = createApolloMockClient({
      Query: () => ({
        person: () => ({
          reverseContactAssignments: () => [
            {
              assignedTo: () => ({ id: myId }),
              organization: () => ({ id: orgId }),
              pathwayStage: () => ({ id: stageId }),
            },
          ],
        }),
      }),
    });

    const result = await paramsForStageNavigation(otherId, orgId, getState);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "contactAssignmentId": "1",
        "firstItemIndex": 0,
        "hasHitCount": false,
        "isMe": false,
        "isNotSure": false,
        "name": "Hayden",
        "questionText": "You completed 3 steps with Hayden. Any changes spiritually?",
        "subsection": "person",
      }
    `);
  });
});

describe('is not Me, "Not Sure" stage, step count not complete', () => {
  beforeEach(() => {
    const newState = {
      ...baseState,
    };
    getState.mockReturnValue(newState);

    apolloClientModule.apolloClient = createApolloMockClient({
      Query: () => ({
        person: () => ({
          reverseContactAssignments: () => [
            {
              assignedTo: () => ({ id: myId }),
              organization: () => ({ id: orgId }),
              pathwayStage: () => ({ id: notSureStageId }),
            },
          ],
        }),
      }),
    });
  });

  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(otherId, orgId, getState);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "contactAssignmentId": "1",
        "firstItemIndex": 1,
        "hasHitCount": false,
        "isMe": false,
        "isNotSure": true,
        "name": "Hayden",
        "questionText": "You completed a step with Hayden. Any changes spiritually?",
        "subsection": "person",
      }
    `);
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

    apolloClientModule.apolloClient = createApolloMockClient({
      Query: () => ({
        person: () => ({
          reverseContactAssignments: () => [
            {
              assignedTo: () => ({ id: myId }),
              organization: () => ({ id: orgId }),
              pathwayStage: () => ({ id: stageId }),
            },
          ],
        }),
      }),
    });
  });

  it('returns correct params', async () => {
    const result = await paramsForStageNavigation(otherId, orgId, getState);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "contactAssignmentId": "1",
        "firstItemIndex": 0,
        "hasHitCount": true,
        "isMe": false,
        "isNotSure": false,
        "name": "Hayden",
        "questionText": "You completed 3 steps with Hayden. Any changes spiritually?",
        "subsection": "person",
      }
    `);
  });
});
