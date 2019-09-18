import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CREATE_STEP } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { buildTrackingObj } from '../../../utils/common';
import { AddPersonStepFlowScreens } from '../addPersonStepFlow';
import { navigatePush } from '../../../actions/navigation';
import { createCustomStep } from '../../../actions/steps';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');

const myId = '111';
const otherId = '222';
const otherName = 'Other';
const orgId = '123';
const stepText = 'Step';

const stage = { id: '1' };
const step = { id: '444', title: stepText };

const trackingObj = buildTrackingObj(
  'people : person : steps : create',
  'people',
  'person',
  'steps',
);

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: '0' } } },
  personProfile: { id: '1', personFirstName: otherName },
  people: { allByOrg: { [otherId]: { id: otherId } } },
});

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = AddPersonStepFlowScreens[screen];

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
const createCustomStepResponse = { type: 'create cutsom step' };

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(navigatePushResponse);
  createCustomStep.mockReturnValue(createCustomStepResponse);
});

describe('PersonSelectStepScreen next', () => {
  describe('select a suggested step', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        PERSON_SELECT_STEP_SCREEN,
        {
          contactStage: stage,
          contactId: otherId,
          organization: { id: orgId },
          contactName: otherName,
        },
        { receiverId: otherId, step, orgId },
      );
    });

    it('should fire required next actions', () => {
      expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
        receiverId: otherId,
        step,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('create a step', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        PERSON_SELECT_STEP_SCREEN,
        {
          contactStage: stage,
          contactId: otherId,
          organization: { id: orgId },
          contactName: otherName,
        },
        { receiverId: otherId, step: undefined, orgId },
      );
    });

    it('should fire required next actions', () => {
      expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        personId: otherId,
        orgId,
        trackingObj,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      SUGGESTED_STEP_DETAIL_SCREEN,
      { receiverId: otherId, step, orgId },
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
        personId: otherId,
        orgId,
        trackingObj,
      },
      { text: stepText, personId: otherId, orgId },
    );
  });

  it('should fire required next actions', () => {
    expect(createCustomStep).toHaveBeenCalledWith(stepText, otherId, orgId);
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN);
    expect(store.getActions()).toEqual([
      createCustomStepResponse,
      navigatePushResponse,
    ]);
  });
});
