import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import {
  contactAssignmentSelector,
  personSelector,
} from '../../../selectors/people';
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
import {
  selectPersonStage,
  updateUserStage,
} from '../../../actions/selectStage';
import { renderWithContext } from '../../../../testUtils';
import { ANALYTICS_CONTEXT_CHANGED } from '../../../actions/analytics';
import { ANALYTICS_PREVIOUS_SCREEN_NAME } from '../../../constants';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/person');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/selectStage');
// jest.mock('../../../actions/stages');

const otherId = '222';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const stage = { id: '1', name: 'Stage 1' };
const person = {
  id: otherId,
  reverse_contact_assignments: [{ id: contactAssignmentId }],
};

const people = { people: { [otherId]: person } };

const initialState = {
  people,
  stages: { stages: [stage, { id: 2, name: 'Stage 2' }] },
  onboarding: { currentlyOnboarding: false },
  drawer: {},
  analytics: {},
};

const buildAndCallNext = (
  screen: keyof typeof SelectPersonStageFlowScreens,
  navParams: Record<string, unknown>,
  newStateIndex = 0,
) => {
  jest.useFakeTimers();
  const Component = SelectPersonStageFlowScreens[screen];

  const renderResult = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  fireEvent.press(
    renderResult.getAllByTestId('stageSelectButton')[newStateIndex],
  );
  jest.runAllTimers();

  return renderResult;
};

const analyticsAction = {
  analyticsContext: {
    [ANALYTICS_PREVIOUS_SCREEN_NAME]: 'mh : stage : stage 1',
  },
  type: ANALYTICS_CONTEXT_CHANGED,
};
const updatePersonResponse = { type: 'update person attributes' };
const getPersonDetailsResponse = { type: 'get person details' };
const loadStepsJourneyResponse = { type: 'load steps and journey' };
const navigatePushResponse = { type: 'navigate push' };
const selectPersonStageResponse = { type: 'selectPersonStage' };
const updateUserStageResponse = { type: 'updateUserStage' };

const screenParams = {
  section: 'people',
  subsection: 'person',
  selectedStageId: 0,
  enableBackButton: false,
  questionText,
  orgId,
  personId: otherId,
};

beforeEach(() => {
  ((personSelector as unknown) as jest.Mock).mockReturnValue(person);
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
    person.reverse_contact_assignments[0],
  );
  (updatePersonAttributes as jest.Mock).mockReturnValue(updatePersonResponse);
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResponse);
  (reloadJourney as jest.Mock).mockReturnValue(loadStepsJourneyResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (selectPersonStage as jest.Mock).mockReturnValue(selectPersonStageResponse);
  (updateUserStage as jest.Mock).mockReturnValue(updateUserStageResponse);
});

describe('SelectStageScreen next', () => {
  describe('isAlreadySelected', () => {
    describe('with contactAssignmentId', () => {
      let renderResult: ReturnType<typeof renderWithContext>;

      beforeEach(() => {
        renderResult = buildAndCallNext(SELECT_STAGE_SCREEN, screenParams);
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(initialState, {
          personId: otherId,
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
        expect(renderResult.store.getActions()).toEqual([
          analyticsAction,
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });

    describe('without contactAssignmentId', () => {
      let renderResult: ReturnType<typeof renderWithContext>;

      beforeEach(() => {
        renderResult = buildAndCallNext(SELECT_STAGE_SCREEN, screenParams);
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
        expect(renderResult.store.getActions()).toEqual([
          analyticsAction,
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });
  });

  describe('not isAlreadySelected', () => {
    describe('with contactAssignmentId', () => {
      let renderResult: ReturnType<typeof renderWithContext>;

      beforeEach(() => {
        renderResult = buildAndCallNext(SELECT_STAGE_SCREEN, screenParams, 1);
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(initialState, {
          personId: otherId,
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
        expect(renderResult.store.getActions()).toEqual([
          analyticsAction,
          updateUserStageResponse,
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });

    describe('skipSelectSteps', () => {
      beforeEach(() => {
        buildAndCallNext(SELECT_STAGE_SCREEN, screenParams);
      });

      it('should navigate to CelebrationScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
          personId: otherId,
          orgId,
        });
      });
    });

    describe('without contactAssignmentId', () => {
      let renderResult: ReturnType<typeof renderWithContext>;

      beforeEach(() => {
        renderResult = buildAndCallNext(SELECT_STAGE_SCREEN, screenParams, 1);
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
        expect(renderResult.store.getActions()).toEqual([
          analyticsAction,
          updateUserStageResponse,
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });
  });
});
