import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CREATE_STEP } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { AddMyStepFlowScreens } from '../addMyStepFlow';
import { navigatePush } from '../../../actions/navigation';
import { createCustomStep } from '../../../actions/steps';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');

const myId = '111';
const orgId = '123';
const stepText = 'hello';

const stage = { id: '1' };
const step = { id: '444', title: stepText };

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: '0' } } },
});

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = AddMyStepFlowScreens[screen];

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
const createCustomStepResponse = { type: 'create custom step' };

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(navigatePushResponse);
  createCustomStep.mockReturnValue(createCustomStepResponse);
});

describe('SelectStepScreen next', () => {
  describe('select a suggested step', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        SELECT_STEP_SCREEN,
        {
          enableBackButton: true,
          contactStage: stage,
          organization: { id: orgId },
        },
        { personId: myId, step, orgId },
      );
    });

    it('should fire required next actions', () => {
      expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
        personId: myId,
        step,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('create a step', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        SELECT_STEP_SCREEN,
        {
          enableBackButton: true,
          contactStage: stage,
          organization: { id: orgId },
        },
        { personId: myId, step: undefined, orgId },
      );
    });

    it('should fire required next actions', () => {
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
  beforeEach(async () => {
    await buildAndCallNext(
      SUGGESTED_STEP_DETAIL_SCREEN,
      { personId: myId, step, orgId },
      {},
    );
  });

  it('should fire required next actions', () => {
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {});
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('AddStepScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        type: CREATE_STEP,
        personId: myId,
        orgId,
      },
      { text: stepText, personId: myId, orgId },
    );
  });

  it('should fire required next actions', () => {
    expect(createCustomStep).toHaveBeenCalledWith(stepText, myId, orgId);
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([
      createCustomStepResponse,
      navigatePushResponse,
    ]);
  });
});
