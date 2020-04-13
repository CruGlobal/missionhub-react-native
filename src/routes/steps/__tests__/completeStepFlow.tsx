/* eslint max-lines: 0 */
import React from 'react';
// eslint-disable-next-line import/named
import { StackActions } from 'react-navigation';
import { AnyAction } from 'redux';
import { MockStore } from 'redux-mock-store';

import { RESET_STEP_COUNT, STEP_NOTE, ACTIONS } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import { paramsForStageNavigation } from '../../utils';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { COMPLETE_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { updateChallengeNote } from '../../../actions/steps';
import { trackAction, trackScreenChange } from '../../../actions/analytics';

jest.mock('../../utils');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/analytics');

const myId = '111';
const otherId = '222';
const stepId = '11';
const orgId = '123';
const questionText = 'Text';

// @ts-ignore
let onFlowComplete = undefined;

let initialState = {};

const buildAndCallNext = async (
  screen: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navParams: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextProps: any,
) => {
  // @ts-ignore
  const Component = CompleteStepFlowScreens(onFlowComplete)[screen];

  const { store, getByType } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  // @ts-ignore
  await store.dispatch(getByType(Component).children[0].props.next(nextProps));
  return { store };
};

const navigatePushResponse = { type: 'navigate push' };
const reloadJourneyResponse = { type: 'reload journey' };
const trackScreenChangeResponse = { type: 'trackScreenChange' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };
const flowCompleteResponse = { type: 'on flow complete' };
const updateChallengeNoteResponse = { type: 'updated challenge note' };
const trackActionResponse = { type: 'tracked action' };

beforeEach(() => {
  StackActions.popToTop = jest.fn().mockReturnValue(popToTopResponse);
  StackActions.pop = jest.fn().mockReturnValue(popResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (reloadJourney as jest.Mock).mockReturnValue(reloadJourneyResponse);
  (updateChallengeNote as jest.Mock).mockReturnValue(
    updateChallengeNoteResponse,
  );
  (trackAction as jest.Mock).mockReturnValue(trackActionResponse);
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
});

describe('AddStepScreen next', () => {
  beforeEach(() => {
    initialState = {
      auth: { person: { id: myId, user: { pathway_stage_id: '0' } } },
      onboarding: { currentlyOnboarding: false },
      drawer: {},
    };
  });

  describe('isMe, stage is not "Not Sure", has not completed 3 steps', () => {
    beforeEach(() => {
      // @ts-ignore
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: false,
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: myId, orgId, type: STEP_NOTE },
        { personId: myId, orgId },
      );

      expect(paramsForStageNavigation).toHaveBeenCalledWith(
        myId,
        orgId,
        store.getState,
      );
      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        personId: myId,
        orgId,
      });
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        navigatePushResponse,
      ]);
    });
  });

  describe('isMe, stage is "Not Sure"', () => {
    beforeEach(() => {
      // @ts-ignore
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: true,
        firstItemIndex: 1,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: myId, orgId, type: STEP_NOTE },
        { personId: myId, orgId },
      );

      expect(paramsForStageNavigation).toHaveBeenCalledWith(
        myId,
        orgId,
        store.getState,
      );
      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        selectedStageId: 1,
        enableBackButton: false,
        questionText,
        orgId,
        personId: myId,
      });
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        { type: RESET_STEP_COUNT, userId: myId },
        navigatePushResponse,
      ]);
    });
  });

  describe('isMe, has completed 3 steps', () => {
    beforeEach(() => {
      // @ts-ignore
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: true,
        isNotSure: false,
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: myId, orgId, type: STEP_NOTE },
        { personId: myId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        selectedStageId: 0,
        enableBackButton: false,
        questionText,
        orgId,
        personId: myId,
      });
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        navigatePushResponse,
      ]);
    });
  });

  describe('not isMe, stage is not "Not Sure", has not completed 3 steps', () => {
    beforeEach(() => {
      // @ts-ignore
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: false,
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        personId: otherId,
        orgId,
      });
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        navigatePushResponse,
      ]);
    });
  });

  describe('not isMe, stage is "Not Sure"', () => {
    beforeEach(() => {
      // @ts-ignore
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: true,
        firstItemIndex: 1,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        selectedStageId: 1,
        enableBackButton: false,
        questionText,
        orgId,
        personId: otherId,
      });
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        { type: RESET_STEP_COUNT, userId: otherId },
        navigatePushResponse,
      ]);
    });
  });

  describe('not isMe, has completed 3 steps', () => {
    beforeEach(() => {
      // @ts-ignore
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: true,
        isNotSure: false,
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        selectedStageId: 0,
        enableBackButton: false,
        questionText,
        orgId,
        personId: otherId,
      });
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        navigatePushResponse,
      ]);
    });
  });

  describe('text is passed in', () => {
    const text = 'roge rules';

    beforeEach(() => {
      // @ts-ignore
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: true,
        isNotSure: false,
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: otherId, orgId, type: STEP_NOTE },
        {
          personId: otherId,
          orgId,
          text,
          id: stepId,
        },
      );

      expect(updateChallengeNote).toHaveBeenCalledWith(stepId, text);
      expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
        [ACTIONS.INTERACTION.COMMENT]: null,
      });
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        updateChallengeNoteResponse,
        trackActionResponse,
        navigatePushResponse,
      ]);
    });
  });
});

describe('CelebrationScreen next', () => {
  describe('onFlowComplete is not passed in', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let store: MockStore<any, AnyAction>;

    beforeEach(async () => {
      initialState = {
        swipe: {
          completeStepExtraBack: false,
        },
        drawer: {},
      };

      onFlowComplete = undefined;

      ({ store } = await buildAndCallNext(
        CELEBRATION_SCREEN,
        { personId: myId, orgId },
        { personId: myId, orgId },
      ));
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should return to top of stack', () => {
      expect(StackActions.popToTop).toHaveBeenCalledTimes(1);
    });

    it('should navigate back', () => {
      expect(StackActions.pop).toHaveBeenCalledWith({
        immediate: true,
      });
    });

    it('should fire required next actions', () => {
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        reloadJourneyResponse,
        popToTopResponse,
        popResponse,
      ]);
    });
  });

  describe('onFlowComplete is passed in', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let store: MockStore<any, AnyAction>;

    beforeEach(async () => {
      initialState = {
        swipe: {
          completeStepExtraBack: true,
        },
        drawer: {},
      };

      onFlowComplete = jest.fn().mockReturnValue(flowCompleteResponse);

      ({ store } = await buildAndCallNext(
        CELEBRATION_SCREEN,
        { personId: myId, orgId },
        { personId: myId, orgId },
      ));
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should return to top of stack', () => {
      expect(StackActions.popToTop).toHaveBeenCalledTimes(1);
    });

    it('should navigate back', () => {
      expect(StackActions.pop).toHaveBeenCalledWith({
        immediate: true,
      });
    });

    it('should call onFlowComplete', () => {
      // @ts-ignore
      expect(onFlowComplete).toHaveBeenCalledTimes(1);
    });

    it('should fire required next actions', () => {
      expect(store.getActions()).toEqual([
        trackScreenChangeResponse,
        reloadJourneyResponse,
        popToTopResponse,
        popResponse,
        flowCompleteResponse,
      ]);
    });
  });
});
