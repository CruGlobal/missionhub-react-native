import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { SelectMyStageFlowScreens } from '../selectMyStageFlow';
import { updatePersonAttributes } from '../../../actions/person';
import { reloadJourney } from '../../../actions/journey';
import { navigatePush } from '../../../actions/navigation';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { renderWithContext } from '../../../../testUtils';
import { selectPersonStage } from '../../../actions/selectStage';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/selectStage');
jest.mock('../../../actions/stages');

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

const initialState = {
  people: { people: { [myId]: mePerson } },
  stages: { stages: [stage] },
  onboarding: { currentlyOnboarding: false },
  drawer: {},
};

const buildAndCallNext = (
  screen: keyof typeof SelectMyStageFlowScreens,
  navParams: Record<string, unknown>,
) => {
  jest.useFakeTimers();
  const Component = SelectMyStageFlowScreens[screen];

  const renderResult = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  fireEvent.press(renderResult.getByTestId('stageSelectButton'));
  jest.runAllTimers();

  return renderResult;
};

const updatePersonResponse = { type: 'update person attributes' };
const reloadJourneyResponse = { type: 'reloadJourney' };
const navigatePushResponse = { type: 'navigate push' };
const selectPersonStageResponse = { type: 'selectPersonStage' };

beforeEach(() => {
  (updatePersonAttributes as jest.Mock).mockReturnValue(updatePersonResponse);
  (reloadJourney as jest.Mock).mockReturnValue(reloadJourneyResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (selectPersonStage as jest.Mock).mockReturnValue(selectPersonStageResponse);
});

describe('SelectStageScreen next', () => {
  describe('isAlreadySelected', () => {
    let renderResult: ReturnType<typeof renderWithContext>;

    beforeEach(() => {
      renderResult = buildAndCallNext(SELECT_STAGE_SCREEN, {
        section: 'people',
        subsection: 'self',
        selectedStageId: 0,
        enableBackButton: false,
        questionText,
        orgId,
        personId: myId,
      });
    });

    it('should update person', () => {
      expect(updatePersonAttributes).toHaveBeenCalledWith(myId, {
        user: { pathway_stage_id: stage.id },
      });
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId);
    });

    it('should navigate to CelebrationScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        personId: myId,
      });
    });

    it('fires correct actions', () => {
      expect(renderResult.store.getActions()).toEqual([
        updatePersonResponse,
        reloadJourneyResponse,
        navigatePushResponse,
      ]);
    });
  });

  describe('not isAlreadySelected', () => {
    let renderResult: ReturnType<typeof renderWithContext>;

    beforeEach(() => {
      renderResult = buildAndCallNext(SELECT_STAGE_SCREEN, {
        section: 'people',
        subsection: 'self',
        selectedStageId: 1,
        enableBackButton: false,
        questionText,
        orgId,
        personId: myId,
      });
    });

    it('should update person', () => {
      expect(updatePersonAttributes).toHaveBeenCalledWith(myId, {
        user: { pathway_stage_id: stage.id },
      });
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId);
    });

    it('should navigate to SelectStepScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
        personId: myId,
      });
    });

    it('fires correct actions', () => {
      expect(renderResult.store.getActions()).toEqual([
        selectPersonStageResponse,
        updatePersonResponse,
        reloadJourneyResponse,
        navigatePushResponse,
      ]);
    });
  });
});
