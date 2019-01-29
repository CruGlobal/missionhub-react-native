import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';

import { STEP_NOTE, ACTIONS } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import * as navigationActions from '../../../actions/navigation';
import { updateChallengeNote } from '../../../actions/steps';
import { getPersonDetails } from '../../../actions/person';
import { trackAction } from '../../../actions/analytics';
import { reloadJourney } from '../../../actions/journey';

import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { STAGE_SCREEN } from '../../../containers/StageScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/person');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/journey');

const myId = '111';
const otherId = '222';
const myName = 'Me';
const otherName = 'Other';
const myStageId = 0;

const baseState = {
  stages: {
    stages: [
      {
        id: 0,
      },
      {
        id: 1,
      },
    ],
    stagesObj: {
      0: {
        id: 0,
        name_i18n: 'stage',
      },
      1: {
        id: 1,
        name_i18n: 'notsure_name',
      },
    },
  },
  auth: {
    person: {
      id: myId,
      first_name: myName,
      user: {
        pathway_stage_id: myStageId,
      },
    },
  },
  steps: {
    userStepCount: {
      [myId]: 1,
      [otherId]: 1,
    },
  },
};

const stepId = '11';
const orgId = '123';

const text = 'text';

const navigatePushResponse = { type: 'navigate push' };

let store = configureStore([thunk])(baseState);

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  navigationActions.navigatePush.mockReturnValue(navigatePushResponse);
});

describe('AddStepScreen next', () => {
  const updateNoteResponse = { type: 'update challenge note' };
  const trackActionResponse = { type: 'track action' };
  const getPersonResponse = { type: 'get person details' };
  const reloadJourneyResponse = { type: 'reload journey' };

  beforeEach(() => {
    updateChallengeNote.mockReturnValue(updateNoteResponse);
    trackAction.mockReturnValue(trackActionResponse);
    getPersonDetails.mockReturnValue(getPersonResponse);
    reloadJourney.mockReturnValue(reloadJourneyResponse);
  });

  describe('isMe', () => {
    describe('stage is not "Not Sure" and has not completed 3 steps', () => {
      beforeEach(() => {
        store = configureStore([thunk])(baseState);
      });

      it('should fire required next actions', async () => {
        const Component = CompleteStepFlowScreens[ADD_STEP_SCREEN].screen;

        await store.dispatch(
          renderShallow(
            <Component
              navigation={{
                state: {
                  params: {
                    stepId,
                    personId: myId,
                    orgId,
                    type: STEP_NOTE,
                  },
                },
              }}
            />,
            store,
          )
            .instance()
            .props.next({
              text,
              stepId,
              personId: myId,
              orgId,
            }),
        );

        expect(updateChallengeNote).toHaveBeenCalledWith(stepId, text);
        expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
          [ACTIONS.INTERACTION.COMMENT]: null,
        });
        expect(getPersonDetails).not.toHaveBeenCalled();
        expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          CELEBRATION_SCREEN,
        );
      });

      it('should fire required next actions without note', async () => {
        const Component = CompleteStepFlowScreens[ADD_STEP_SCREEN].screen;

        await store.dispatch(
          renderShallow(
            <Component
              navigation={{
                state: {
                  params: {
                    stepId,
                    personId: myId,
                    orgId,
                    type: STEP_NOTE,
                  },
                },
              }}
            />,
            store,
          )
            .instance()
            .props.next({
              text: null,
              stepId,
              personId: myId,
              orgId,
            }),
        );

        expect(updateChallengeNote).not.toHaveBeenCalled();
        expect(trackAction).not.toHaveBeenCalled();
        expect(getPersonDetails).not.toHaveBeenCalled();
        expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          CELEBRATION_SCREEN,
        );
      });
    });

    describe('stage is "Not Sure"', () => {
      beforeEach(() => {
        store = configureStore([thunk])({
          ...baseState,
          auth: {
            ...baseState.auth,
            person: {
              ...baseState.auth.person,
              user: {
                pathway_stage_id: 1,
              },
            },
          },
        });
      });

      it('should fire required next actions, ', async () => {
        const Component = CompleteStepFlowScreens[ADD_STEP_SCREEN].screen;

        await store.dispatch(
          renderShallow(
            <Component
              navigation={{
                state: {
                  params: {
                    stepId,
                    personId: myId,
                    orgId,
                    type: STEP_NOTE,
                  },
                },
              }}
            />,
            store,
          )
            .instance()
            .props.next({
              text,
              stepId,
              personId: myId,
              orgId,
            }),
        );

        expect(updateChallengeNote).toHaveBeenCalledWith(stepId, text);
        expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
          [ACTIONS.INTERACTION.COMMENT]: null,
        });
        expect(getPersonDetails).not.toHaveBeenCalled();
        expect(reloadJourney).not.toHaveBeenCalled();
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'self',
            firstItem: 1,
            enableBackButton: false,
            noNav: true,
            questionText: i18next.t('selectStage:meQuestion', {
              name: myName,
            }),
            orgId,
            contactId: myId,
          },
        );
      });
    });

    describe('has completed 3 steps', () => {
      beforeEach(() => {
        store = configureStore([thunk])({
          ...baseState,
          steps: {
            ...baseState.steps,
            userStepCount: {
              ...baseState.steps.userStepCount,
              [myId]: 3,
            },
          },
        });
      });
      it('should fire required next actions, ', async () => {
        const Component = CompleteStepFlowScreens[ADD_STEP_SCREEN].screen;

        await store.dispatch(
          renderShallow(
            <Component
              navigation={{
                state: {
                  params: {
                    stepId,
                    personId: myId,
                    orgId,
                    type: STEP_NOTE,
                  },
                },
              }}
            />,
            store,
          )
            .instance()
            .props.next({
              text,
              stepId,
              personId: myId,
              orgId,
            }),
        );

        expect(updateChallengeNote).toHaveBeenCalledWith(stepId, text);
        expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
          [ACTIONS.INTERACTION.COMMENT]: null,
        });
        expect(getPersonDetails).not.toHaveBeenCalled();
        expect(reloadJourney).not.toHaveBeenCalled();
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'self',
            firstItem: 0,
            enableBackButton: false,
            noNav: true,
            questionText: i18next.t('selectStage:completed3StepsMe', {
              name: myName,
            }),
            orgId,
            contactId: myId,
          },
        );
      });
    });
  });

  describe('not isMe', () => {
    const personId = '222';

    describe('stage is not "Not Sure" and has not completed 3 steps', () => {
      it('should fire required next actions, ', async () => {});
    });

    describe('stage is "Not Sure"', () => {
      it('should fire required next actions, ', async () => {});
    });

    describe('has completed 3 steps', () => {
      it('should fire required next actions, ', async () => {});
    });
  });
});

describe('StageScreen next', () => {});

describe('PersonStageScreen next', () => {});

describe('SelectMyStepScreen next', () => {});

describe('PersonSelectStepScreen next', () => {});

describe('CelebrationScreen next', () => {});
