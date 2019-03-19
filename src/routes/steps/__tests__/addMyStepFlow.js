import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { AddMyStepFlowScreens } from '../addMyStepFlow';
import { navigatePush } from '../../../actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');

const myId = '111';
const orgId = '123';

const stage = { id: 1 };

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: 0 } } },
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

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('SelectMyStepScreen next', () => {
  it('navigate to CelebrationScreen', async () => {
    await buildAndCallNext(
      SELECT_MY_STEP_SCREEN,
      {
        enableBackButton: true,
        contactStage: stage,
        organization: { id: orgId },
      },
      {},
    );

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {});
  });
});
