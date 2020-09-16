import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { personSelector } from '../../../selectors/people';
import { SelectPersonStageFlowScreens } from '../selectPersonStageFlow';
import {
  updatePersonAttributes,
  getPersonDetails,
} from '../../../actions/person';
import { reloadJourney } from '../../../actions/journey';
import { navigatePush } from '../../../actions/navigation';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen/index';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/person');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/navigation');

const otherId = '222';
const otherName = 'Other';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const stage = { id: '1' };
const person = {
  id: otherId,
  reverse_contact_assignments: [{ id: contactAssignmentId }],
};

const people = { people: { [otherId]: person } };

const initialState = {
  people,
  stages: { stages: [stage] },
  onboarding: { currentlyOnboarding: false },
};

const store = configureStore([thunk])(initialState);

// @ts-ignore
const buildAndCallNext = async (screen, navParams, nextProps) => {
  // @ts-ignore
  const Component = SelectPersonStageFlowScreens[screen];

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
const getPersonDetailsResponse = { type: 'get person details' };
const loadStepsJourneyResponse = { type: 'load steps and journey' };
const navigatePushResponse = { type: 'navigate push' };

const screenParams = {
  section: 'people',
  subsection: 'person',
  SelectedStageId: 0,
  enableBackButton: false,
  questionText,
  orgId,
  personId: otherId,
};
const navParams = {
  stage,
  orgId,
  isAlreadySelected: true,
  personId: otherId,
  firstName: otherName,
};

beforeEach(() => {
  store.clearActions();
  // @ts-ignore
  personSelector.mockReturnValue(person);
  // @ts-ignore
  updatePersonAttributes.mockReturnValue(updatePersonResponse);
  // @ts-ignore
  getPersonDetails.mockReturnValue(getPersonDetailsResponse);
  // @ts-ignore
  reloadJourney.mockReturnValue(loadStepsJourneyResponse);
  // @ts-ignore
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('SelectStageScreen next', () => {
  describe('isAlreadySelected', () => {
    describe('with contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(SELECT_STAGE_SCREEN, screenParams, {
          ...navParams,
          contactAssignmentId,
        });
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(initialState, {
          personId: otherId,
        });
      });

      it('should update person', () => {
        expect(updatePersonAttributes).toHaveBeenCalledWith(otherId, {
          reverse_contact_assignments: [
            { id: contactAssignmentId, pathway_stage_id: stage.id },
          ],
        });
      });

      it('should load steps and journey', () => {
        expect(reloadJourney).toHaveBeenCalledWith(otherId);
      });

      it('should navigate to CelebrationScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
          personId: otherId,
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

    describe('without contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(SELECT_STAGE_SCREEN, screenParams, {
          ...navParams,
        });
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(initialState, {
          personId: otherId,
        });
      });

      it('should get person details', () => {
        expect(getPersonDetails).toHaveBeenCalledWith(otherId);
      });

      it('should load steps and journey', () => {
        expect(reloadJourney).toHaveBeenCalledWith(otherId);
      });

      it('should navigate to CelebrationScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
          personId: otherId,
          orgId,
        });
      });

      it('fires correct actions', () => {
        expect(store.getActions()).toEqual([
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });
  });

  describe('not isAlreadySelected', () => {
    describe('with contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(SELECT_STAGE_SCREEN, screenParams, {
          ...navParams,
          contactAssignmentId,
          isAlreadySelected: false,
        });
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(initialState, {
          personId: otherId,
        });
      });

      it('should update person', () => {
        expect(updatePersonAttributes).toHaveBeenCalledWith(otherId, {
          reverse_contact_assignments: [
            { id: contactAssignmentId, pathway_stage_id: stage.id },
          ],
        });
      });

      it('should load steps and journey', () => {
        expect(reloadJourney).toHaveBeenCalledWith(otherId);
      });

      it('should navigate to PersonSelectStepScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
          personId: otherId,
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

    describe('skipSelectSteps', () => {
      beforeEach(async () => {
        await buildAndCallNext(SELECT_STAGE_SCREEN, screenParams, {
          ...navParams,
          contactAssignmentId,
          isAlreadySelected: false,
          skipSelectSteps: true,
        });
      });

      it('should navigate to CelebrationScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
          personId: otherId,
          orgId,
        });
      });
    });

    describe('without contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(SELECT_STAGE_SCREEN, screenParams, {
          ...navParams,
          isAlreadySelected: false,
        });
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(initialState, {
          personId: otherId,
        });
      });

      it('should get person details', () => {
        expect(getPersonDetails).toHaveBeenCalledWith(otherId);
      });

      it('should load steps and journey', () => {
        expect(reloadJourney).toHaveBeenCalledWith(otherId);
      });

      it('should navigate to PersonSelectStepScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
          personId: otherId,
          orgId,
        });
      });

      it('fires correct actions', () => {
        expect(store.getActions()).toEqual([
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });
  });
});
