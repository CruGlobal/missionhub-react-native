/* eslint max-lines: 0 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
// eslint-disable-next-line import/named
import { StackActions } from 'react-navigation';

import { RESET_STEP_COUNT, STEP_NOTE, ACTIONS } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import { paramsForStageNavigation } from '../../utils';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { COMPLETE_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { updateChallengeNote } from '../../../actions/steps';
import { trackAction } from '../../../actions/analytics';

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

let onFlowComplete = undefined;

let store = configureStore([thunk])();

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = CompleteStepFlowScreens(onFlowComplete)[screen];

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
const reloadJourneyResponse = { type: 'reload journey' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };
const flowCompleteResponse = { type: 'on flow complete' };
const updateChallengeNoteResponse = { type: 'updated challenge note' };
const trackActionResponse = { type: 'tracked action' };

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(navigatePushResponse);
  StackActions.popToTop = jest.fn().mockReturnValue(popToTopResponse);
  StackActions.pop = jest.fn().mockReturnValue(popResponse);
  reloadJourney.mockReturnValue(reloadJourneyResponse);
  updateChallengeNote.mockReturnValue(updateChallengeNoteResponse);
  trackAction.mockReturnValue(trackActionResponse);
});

describe('AddStepScreen next', () => {
  beforeEach(() => {
    store = configureStore([thunk])({
      auth: { person: { id: myId, user: { pathway_stage_id: '0' } } },
    });
  });

  describe('isMe, stage is not "Not Sure", has not completed 3 steps', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: false,
        subsection: 'self',
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
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
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('isMe, stage is "Not Sure"', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: true,
        subsection: 'self',
        firstItemIndex: 1,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
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
        section: 'people',
        subsection: 'self',
        selectedStageId: 1,
        enableBackButton: false,
        questionText,
        orgId,
        personId: myId,
      });
      expect(store.getActions()).toEqual([
        { type: RESET_STEP_COUNT, userId: myId },
        navigatePushResponse,
      ]);
    });
  });

  describe('isMe, has completed 3 steps', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: true,
        isNotSure: false,
        subsection: 'self',
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: myId, orgId, type: STEP_NOTE },
        { personId: myId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        section: 'people',
        subsection: 'self',
        selectedStageId: 0,
        enableBackButton: false,
        questionText,
        orgId,
        personId: myId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('not isMe, stage is not "Not Sure", has not completed 3 steps', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: false,
        subsection: 'person',
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        personId: otherId,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('not isMe, stage is "Not Sure"', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: false,
        isNotSure: true,
        subsection: 'person',
        firstItemIndex: 1,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        section: 'people',
        subsection: 'person',
        selectedStageId: 1,
        enableBackButton: false,
        questionText,
        orgId,
        personId: otherId,
      });
      expect(store.getActions()).toEqual([
        { type: RESET_STEP_COUNT, userId: otherId },
        navigatePushResponse,
      ]);
    });
  });

  describe('not isMe, has completed 3 steps', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: true,
        isNotSure: false,
        subsection: 'person',
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { id: stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        section: 'people',
        subsection: 'person',
        selectedStageId: 0,
        enableBackButton: false,
        questionText,
        orgId,
        personId: otherId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('text is passed in', () => {
    const text = 'roge rules';

    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        hasHitCount: true,
        isNotSure: false,
        subsection: 'person',
        firstItemIndex: 0,
        questionText,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
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
        updateChallengeNoteResponse,
        trackActionResponse,
        navigatePushResponse,
      ]);
    });
  });
});

describe('CelebrationScreen next', () => {
  describe('onFlowComplete is not passed in', () => {
    beforeEach(async () => {
      store = configureStore([thunk])({
        swipe: {
          completeStepExtraBack: false,
        },
      });

      onFlowComplete = undefined;

      await buildAndCallNext(
        CELEBRATION_SCREEN,
        { personId: myId, orgId },
        { personId: myId, orgId },
      );
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
        reloadJourneyResponse,
        popToTopResponse,
        popResponse,
      ]);
    });
  });

  describe('onFlowComplete is passed in', () => {
    beforeEach(async () => {
      store = configureStore([thunk])({
        swipe: {
          completeStepExtraBack: true,
        },
      });

      onFlowComplete = jest.fn().mockReturnValue(flowCompleteResponse);

      await buildAndCallNext(
        CELEBRATION_SCREEN,
        { personId: myId, orgId },
        { personId: myId, orgId },
      );
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
      expect(onFlowComplete).toHaveBeenCalledTimes(1);
    });

    it('should fire required next actions', () => {
      expect(store.getActions()).toEqual([
        reloadJourneyResponse,
        popToTopResponse,
        popResponse,
        flowCompleteResponse,
      ]);
    });
  });
});
