import React from 'react';

import { CREATE_STEP } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { AddPersonStepFlowScreens } from '../addPersonStepFlow';
import { navigatePush } from '../../../actions/navigation';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/hooks/useAnalytics');

const myId = '111';
const otherId = '222';
const orgId = '123';
const stepText = 'Step';
const stageId = '3';

const me = { id: myId, user: { pathway_stage_id: '0' } };
const person = {
  id: otherId,
  first_name: 'Test Person',
  reverse_contact_assignments: [
    {
      assigned_to: { id: me.id },
      organization: { id: orgId },
      pathway_stage_id: stageId,
    },
  ],
  organizational_permissions: [{ organization_id: orgId }],
};
const stage = { id: '1' };
const stepSuggestionId = '444';

const initialState = {
  auth: { person: me },
  onboarding: { personId: otherId, currentlyOnboarding: false },
  people: {
    people: { [person.id]: person },
  },
  organizations: { all: [] },
  steps: { suggestedForOthers: { [stageId]: [stage] } },
};

// @ts-ignore
const buildAndCallNext = async (screen, navParams, nextProps) => {
  // @ts-ignore
  const Component = AddPersonStepFlowScreens[screen];

  const { store, getByType } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  // @ts-ignore
  await store.dispatch(getByType(Component).children[0].props.next(nextProps));
  return { store };
};

const navigatePushResponse = { type: 'navigate push' };

beforeEach(() => {
  // @ts-ignore
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('SelectStepScreen next', () => {
  describe('select a suggested step', () => {
    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        SELECT_STEP_SCREEN,
        {
          personId: otherId,
          orgId,
        },
        { personId: otherId, stepSuggestionId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
        personId: otherId,
        stepSuggestionId,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('create a step', () => {
    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        SELECT_STEP_SCREEN,
        {
          personId: otherId,
          orgId,
        },
        { personId: otherId, step: undefined, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        personId: otherId,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  it('should fire required next actions', async () => {
    const { store } = await buildAndCallNext(
      SUGGESTED_STEP_DETAIL_SCREEN,
      { personId: otherId, stepSuggestionId, orgId },
      {},
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {});
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('AddStepScreen next', () => {
  it('should fire required next actions', async () => {
    const { store } = await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        type: CREATE_STEP,
        personId: otherId,
        orgId,
      },
      { text: stepText, personId: otherId, orgId },
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});
