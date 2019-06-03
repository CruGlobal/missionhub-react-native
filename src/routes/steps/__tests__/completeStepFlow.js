/* eslint max-lines: 0 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { RESET_STEP_COUNT, STEP_NOTE, ACTIONS } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import { paramsForStageNavigation } from '../../utils';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { COMPLETE_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { STAGE_SCREEN } from '../../../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
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
const myName = 'Me';
const otherName = 'Other';
const stepId = '11';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const reverseContactAssignment = {
  id: contactAssignmentId,
};

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
  reactNavigation.StackActions.popToTop = jest
    .fn()
    .mockReturnValue(popToTopResponse);
  reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);
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
        isMe: true,
        hasHitCount: false,
        isNotSure: false,
        subsection: 'self',
        firstItemIndex: 0,
        questionText,
        assignment: null,
        name: myName,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { stepId, personId: myId, orgId, type: STEP_NOTE },
        { personId: myId, orgId },
      );

      expect(paramsForStageNavigation).toHaveBeenCalledWith(
        myId,
        orgId,
        store.getState,
      );
      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        contactId: myId,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('isMe, stage is "Not Sure"', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        isMe: true,
        hasHitCount: false,
        isNotSure: true,
        subsection: 'self',
        firstItemIndex: 1,
        questionText,
        assignment: null,
        name: myName,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { stepId, personId: myId, orgId, type: STEP_NOTE },
        { personId: myId, orgId },
      );

      expect(paramsForStageNavigation).toHaveBeenCalledWith(
        myId,
        orgId,
        store.getState,
      );
      expect(navigatePush).toHaveBeenCalledWith(STAGE_SCREEN, {
        section: 'people',
        subsection: 'self',
        firstItem: 1,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: myId,
        contactAssignmentId: null,
        name: myName,
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
        isMe: true,
        hasHitCount: true,
        isNotSure: false,
        subsection: 'self',
        firstItemIndex: 0,
        questionText,
        assignment: null,
        name: myName,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { stepId, personId: myId, orgId, type: STEP_NOTE },
        { personId: myId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(STAGE_SCREEN, {
        section: 'people',
        subsection: 'self',
        firstItem: 0,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: myId,
        contactAssignmentId: null,
        name: myName,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('not isMe, stage is not "Not Sure", has not completed 3 steps', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        isMe: false,
        hasHitCount: false,
        isNotSure: false,
        subsection: 'person',
        firstItemIndex: 0,
        questionText,
        assignment: reverseContactAssignment,
        name: otherName,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        contactId: otherId,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('not isMe, stage is "Not Sure"', () => {
    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        isMe: false,
        hasHitCount: false,
        isNotSure: true,
        subsection: 'person',
        firstItemIndex: 1,
        questionText,
        assignment: reverseContactAssignment,
        name: otherName,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
        section: 'people',
        subsection: 'person',
        firstItem: 1,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: otherId,
        contactAssignmentId,
        name: otherName,
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
        isMe: false,
        hasHitCount: true,
        isNotSure: false,
        subsection: 'person',
        firstItemIndex: 0,
        questionText,
        assignment: reverseContactAssignment,
        name: otherName,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { stepId, personId: otherId, orgId, type: STEP_NOTE },
        { personId: otherId, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
        section: 'people',
        subsection: 'person',
        firstItem: 0,
        enableBackButton: false,
        noNav: true,
        questionText,
        orgId,
        contactId: otherId,
        contactAssignmentId,
        name: otherName,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('text is passed in', () => {
    const text = 'roge rules';

    beforeEach(() => {
      paramsForStageNavigation.mockReturnValue({
        isMe: false,
        hasHitCount: true,
        isNotSure: false,
        subsection: 'person',
        firstItemIndex: 0,
        questionText,
        assignment: reverseContactAssignment,
        name: otherName,
      });
    });

    it('should fire required next actions', async () => {
      await buildAndCallNext(
        COMPLETE_STEP_SCREEN,
        { stepId, personId: otherId, orgId, type: STEP_NOTE },
        {
          personId: otherId,
          orgId,
          text,
          stepId,
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
        { contactId: myId, orgId },
        { contactId: myId, orgId },
      );
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should return to top of stack', () => {
      expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
    });

    it('should navigate back', () => {
      expect(reactNavigation.StackActions.pop).toHaveBeenCalledWith({
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
        { contactId: myId, orgId },
        { contactId: myId, orgId },
      );
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    });

    it('should return to top of stack', () => {
      expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
    });

    it('should navigate back', () => {
      expect(reactNavigation.StackActions.pop).toHaveBeenCalledWith({
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
