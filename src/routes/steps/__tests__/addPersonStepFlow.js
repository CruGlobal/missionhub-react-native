import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { buildTrackingObj } from '../../../utils/common';
import { AddPersonStepFlowScreens } from '../addPersonStepFlow';
import { navigatePush } from '../../../actions/navigation';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');

const myId = '111';
const otherId = '222';
const otherName = 'Other';
const orgId = '123';

const stage = { id: 1 };

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: '0' } } },
  personProfile: { id: '1', personFirstName: otherName },
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

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('PersonSelectStepScreen next', () => {
  it('should navigate to CelebrationScreen', async () => {
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
