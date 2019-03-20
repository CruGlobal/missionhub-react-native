import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { SelectMyStageFlowScreens } from '../selectMyStageFlow';
import { navigatePush } from '../../../actions/navigation';
import { STAGE_SCREEN } from '../../../containers/StageScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');

const myId = '111';
const myName = 'Me';
const orgId = '123';
const questionText = 'Text';

const stage = { id: 1 };

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: 0 } } },
  profile: { id: '2', firstName: myName },
});

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = SelectMyStageFlowScreens[screen];

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

describe('StageScreen next', () => {
  describe('isAlreadySelected', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'self',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText,
          orgId,
          contactId: myId,
        },
        { stage, contactId: myId, orgId, isAlreadySelected: true },
      );
    });

    it('should navigate to CelebrationScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        contactId: myId,
        orgId,
      });
    });
  });

  describe('not isAlreadySelected', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'self',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText,
          orgId,
          contactId: myId,
        },
        { stage, contactId: myId, orgId, isAlreadySelected: false },
      );
    });

    it('should navigate to SelectMyStepScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
        contactId: myId,
        enableBackButton: true,
        contactStage: stage,
        organization: { id: orgId },
      });
    });
  });
});
