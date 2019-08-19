import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { SelectMyStageFlowScreens } from '../selectMyStageFlow';
import { updatePersonAttributes } from '../../../actions/person';
import { loadStepsAndJourney } from '../../../actions/misc';
import { navigatePush } from '../../../actions/navigation';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../actions/misc');

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
  people: { allByOrg: { personal: { people: { [myId]: mePerson } } } },
  stages: { stages: [stage] },
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

const updatePersonResponse = { type: 'update person attributes' };
const loadStepsJourneyResponse = { type: 'load steps and journey' };
const navigatePushResponse = { type: 'navigate push' };

beforeEach(() => {
  store.clearActions();
  updatePersonAttributes.mockReturnValue(updatePersonResponse);
  loadStepsAndJourney.mockReturnValue(loadStepsJourneyResponse);
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

    it('should load steps and journey', () => {
      expect(loadStepsAndJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should navigate to CelebrationScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        contactId: myId,
        orgId,
      });
    });

    it('fires correct actions', () => {
      expect(store.getActions()).toEqual([
        updatePersonResponse,
        loadStepsJourneyResponse,
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

    it('should load steps and journey', () => {
      expect(loadStepsAndJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should navigate to SelectMyStepScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_SCREEN, {
        contactStage: stage,
        organization: { id: orgId },
      });
    });

    it('fires correct actions', () => {
      expect(store.getActions()).toEqual([
        updatePersonResponse,
        loadStepsJourneyResponse,
        navigatePushResponse,
      ]);
    });
  });
});
