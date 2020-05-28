import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { SelectMyStageFlowScreens } from '../selectMyStageFlow';
import { updatePersonAttributes } from '../../../actions/person';
import { reloadJourney } from '../../../actions/journey';
import { navigatePush } from '../../../actions/navigation';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../actions/journey');

const myId = '111';
const myName = 'Me';
const orgId = '123';
const questionText = 'Text';

const stage = { id: 1 };
const mePerson = {
  id: myId,
  first_name: myName,
  user: { pathway_stage_id: 0 },
};

const store = configureStore([thunk])({
  auth: { person: mePerson },
  people: { people: { [myId]: mePerson } },
  stages: { stages: [stage] },
  onboarding: { currentlyOnboarding: false },
});

// @ts-ignore
const buildAndCallNext = async (screen, navParams, nextProps) => {
  // @ts-ignore
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
      // @ts-ignore
      .props.next(nextProps),
  );
};

const updatePersonResponse = { type: 'update person attributes' };
const reloadJourneyResponse = { type: 'reloadJourney' };
const navigatePushResponse = { type: 'navigate push' };

beforeEach(() => {
  store.clearActions();
  // @ts-ignore
  updatePersonAttributes.mockReturnValue(updatePersonResponse);
  // @ts-ignore
  reloadJourney.mockReturnValue(reloadJourneyResponse);
  // @ts-ignore
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('SelectStageScreen next', () => {
  describe('isAlreadySelected', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        SELECT_STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'self',
          selectedStageId: 0,
          enableBackButton: false,
          questionText,
          orgId,
          personId: myId,
        },
        { stage, personId: myId, orgId, isAlreadySelected: true },
      );
    });

    it('should update person', () => {
      expect(updatePersonAttributes).toHaveBeenCalledWith(myId, {
        user: { pathway_stage_id: stage.id },
      });
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should navigate to CelebrationScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        personId: myId,
        orgId,
      });
    });

    it('fires correct actions', () => {
      expect(store.getActions()).toEqual([
        updatePersonResponse,
        reloadJourneyResponse,
        navigatePushResponse,
      ]);
    });
  });

  describe('not isAlreadySelected', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        SELECT_STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'self',
          selectedStageId: 0,
          enableBackButton: false,
          questionText,
          orgId,
          personId: myId,
        },
        { stage, personId: myId, orgId, isAlreadySelected: false },
      );
    });

    it('should update person', () => {
      expect(updatePersonAttributes).toHaveBeenCalledWith(myId, {
        user: { pathway_stage_id: stage.id },
      });
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should navigate to SelectStepScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
        personId: myId,
        organization: { id: orgId },
      });
    });

    it('fires correct actions', () => {
      expect(store.getActions()).toEqual([
        updatePersonResponse,
        reloadJourneyResponse,
        navigatePushResponse,
      ]);
    });
  });
});
