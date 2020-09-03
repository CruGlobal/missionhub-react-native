import React from 'react';

import { CREATE_STEP } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { AddMyStepFlowScreens } from '../addMyStepFlow';
import { navigatePush } from '../../../actions/navigation';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/hooks/useAnalytics');

const myId = '111';
const orgId = '123';
const stepText = 'hello';

const stage = { id: '1' };
const stepSuggestionId = '444';

const initialState = {
  people: { people: { [myId]: {} } },
  steps: { suggestedForMe: { [stage.id]: [stage] } },
  onboarding: { currentlyOnboarding: false },
};

// @ts-ignore
const buildAndCallNext = async (screen, navParams, nextProps) => {
  // @ts-ignore
  const Component = AddMyStepFlowScreens[screen];

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
          enableBackButton: true,
          contactStage: stage,
          personId: myId,
          orgId,
        },
        { personId: myId, stepSuggestionId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
        personId: myId,
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
          enableBackButton: true,
          contactStage: stage,
          personId: myId,
          orgId,
        },
        { personId: myId, step: undefined, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        personId: myId,
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
      { personId: myId, orgId },
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
        personId: myId,
        orgId,
      },
      { text: stepText, personId: myId, orgId },
    );
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});
