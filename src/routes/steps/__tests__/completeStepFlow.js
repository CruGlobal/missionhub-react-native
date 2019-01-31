import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';
import * as reactNavigation from 'react-navigation';

import { RESET_STEP_COUNT, STEP_NOTE } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { buildTrackingObj } from '../../../utils/common';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import * as navigationActions from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { personSelector } from '../../../selectors/people';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { STAGE_SCREEN } from '../../../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { SELECT_MY_STEP_SCREEN } from '../../../containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/journey');
jest.mock('../../../selectors/people');

const myId = '111';
const otherId = '222';
const myName = 'Me';
const otherName = 'Other';
const myStageId = 0;
const stepId = '11';
const orgId = '123';
const contactAssignmentId = '22';

const stage = { id: 1 };
const reverseContactAssignment = {
  id: contactAssignmentId,
  organization: {
    id: orgId,
  },
  assigned_to: {
    id: myId,
  },
  pathway_stage_id: 0,
};
const otherPerson = {
  id: otherId,
  first_name: otherName,
  reverse_contact_assignments: [reverseContactAssignment],
};
const otherPersonNotSure = {
  ...otherPerson,
  reverse_contact_assignments: [
    { ...reverseContactAssignment, pathway_stage_id: 1 },
  ],
};

const people = { allByOrg: {} };

const navigatePushResponse = { type: 'navigate push' };

const baseState = {
  stages: {
    stages: [{ id: 0 }, { id: 1 }],
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
  steps: { userStepCount: { [myId]: 1, [otherId]: 1 } },
  people,
  profile: { firstName: myName },
  personProfile: { firstName: otherName },
};

let store = configureStore([thunk])(baseState);

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = CompleteStepFlowScreens[screen].screen;

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

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  navigationActions.navigatePush.mockReturnValue(navigatePushResponse);
});

describe('AddStepScreen next', () => {
  const reloadJourneyResponse = { type: 'reload journey' };

  beforeEach(() => {
    personSelector.mockReturnValue(otherPerson);
    reloadJourney.mockReturnValue(reloadJourneyResponse);
  });

  describe('isMe', () => {
    describe('stage is not "Not Sure" and has not completed 3 steps', () => {
      beforeEach(() => {
        store = configureStore([thunk])(baseState);
      });

      it('should fire required next actions', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: myId, orgId, type: STEP_NOTE },
          { personId: myId, orgId },
        );

        expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          CELEBRATION_SCREEN,
        );
        expect(store.getActions()).toEqual([
          reloadJourneyResponse,
          navigatePushResponse,
        ]);
      });

      it('should fire required next actions without note', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: myId, orgId, type: STEP_NOTE },
          { personId: myId, orgId },
        );

        expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          CELEBRATION_SCREEN,
        );
        expect(store.getActions()).toEqual([
          reloadJourneyResponse,
          navigatePushResponse,
        ]);
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

      it('should fire required next actions', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: myId, orgId, type: STEP_NOTE },
          { personId: myId, orgId },
        );

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
            contactAssignmentId: null,
            name: myName,
          },
        );
        expect(store.getActions()).toEqual([
          { type: RESET_STEP_COUNT, userId: myId },
          navigatePushResponse,
        ]);
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
      it('should fire required next actions', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: myId, orgId, type: STEP_NOTE },
          { personId: myId, orgId },
        );

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
            contactAssignmentId: null,
            name: myName,
          },
        );
        expect(store.getActions()).toEqual([navigatePushResponse]);
      });
    });
  });

  describe('not isMe', () => {
    describe('stage is not "Not Sure" and has not completed 3 steps', () => {
      beforeEach(() => {
        store = configureStore([thunk])(baseState);
      });

      it('should fire required next actions', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: otherId, orgId, type: STEP_NOTE },
          { personId: otherId, orgId },
        );

        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
        expect(reloadJourney).toHaveBeenCalledWith(otherId, orgId);
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          CELEBRATION_SCREEN,
        );
        expect(store.getActions()).toEqual([
          reloadJourneyResponse,
          navigatePushResponse,
        ]);
      });

      it('should fire required next actions without note', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: otherId, orgId, type: STEP_NOTE },
          { personId: otherId, orgId },
        );

        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
        expect(reloadJourney).toHaveBeenCalledWith(otherId, orgId);
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          CELEBRATION_SCREEN,
        );
        expect(store.getActions()).toEqual([
          reloadJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });

    describe('stage is "Not Sure"', () => {
      beforeEach(() => {
        store = configureStore([thunk])(baseState);
        personSelector.mockReturnValue(otherPersonNotSure);
      });

      it('should fire required next actions', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: otherId, orgId, type: STEP_NOTE },
          { personId: otherId, orgId },
        );

        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
        expect(reloadJourney).not.toHaveBeenCalled();
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          PERSON_STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'person',
            firstItem: 1,
            enableBackButton: false,
            noNav: true,
            questionText: i18next.t('selectStage:completed1Step', {
              name: otherName,
            }),
            orgId,
            contactId: otherId,
            contactAssignmentId,
            name: otherName,
          },
        );
        expect(store.getActions()).toEqual([
          { type: RESET_STEP_COUNT, userId: otherId },
          navigatePushResponse,
        ]);
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
              [otherId]: 3,
            },
          },
        });
      });

      it('should fire required next actions', async () => {
        await buildAndCallNext(
          ADD_STEP_SCREEN,
          { stepId, personId: otherId, orgId, type: STEP_NOTE },
          { personId: otherId, orgId },
        );

        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
        expect(reloadJourney).not.toHaveBeenCalled();
        expect(navigationActions.navigatePush).toHaveBeenCalledWith(
          PERSON_STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'person',
            firstItem: 0,
            enableBackButton: false,
            noNav: true,
            questionText: i18next.t('selectStage:completed3Steps', {
              name: otherName,
            }),
            orgId,
            contactId: otherId,
            contactAssignmentId,
            name: otherName,
          },
        );
        expect(store.getActions()).toEqual([navigatePushResponse]);
      });
    });
  });
});

describe('StageScreen next', () => {
  beforeEach(() => {
    store = configureStore([thunk])(baseState);
  });

  describe('isAlreadySelected', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'self',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText: i18next.t('selectStage:meQuestion', { name: myName }),
          orgId,
          contactId: myId,
        },
        { stage, contactId: myId, orgId, isAlreadySelected: true },
      );

      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
      expect(navigationActions.navigatePush).toHaveBeenCalledWith(
        CELEBRATION_SCREEN,
      );
    });
  });

  describe('not isAlreadySelected', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'self',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText: i18next.t('selectStage:meQuestion', { name: myName }),
          orgId,
          contactId: myId,
        },
        { stage, contactId: myId, orgId, isAlreadySelected: false },
      );

      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
      expect(navigationActions.navigatePush).toHaveBeenCalledWith(
        SELECT_MY_STEP_SCREEN,
        {
          enableBackButton: true,
          contactStage: stage,
          organization: { id: orgId },
        },
      );
    });
  });
});

describe('PersonStageScreen next', () => {
  beforeEach(() => {
    store = configureStore([thunk])(baseState);
  });

  describe('isAlreadySelected', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        PERSON_STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'person',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText: i18next.t('selectStage:completed3Steps', {
            name: otherName,
          }),
          orgId,
          contactId: otherId,
          contactAssignmentId,
          name: otherName,
        },
        {
          stage,
          contactId: otherId,
          name: otherName,
          orgId,
          isAlreadySelected: true,
        },
      );

      expect(reloadJourney).toHaveBeenCalledWith(otherId, orgId);
      expect(navigationActions.navigatePush).toHaveBeenCalledWith(
        CELEBRATION_SCREEN,
      );
    });
  });

  describe('not isAlreadySelected', () => {
    it('should fire required next actions', async () => {
      await buildAndCallNext(
        PERSON_STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'person',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText: i18next.t('selectStage:completed3Steps', {
            name: otherName,
          }),
          orgId,
          contactId: otherId,
          contactAssignmentId,
          name: otherName,
        },
        {
          stage,
          contactId: otherId,
          name: otherName,
          orgId,
          isAlreadySelected: false,
        },
      );

      expect(reloadJourney).toHaveBeenCalledWith(otherId, orgId);
      expect(navigationActions.navigatePush).toHaveBeenCalledWith(
        PERSON_SELECT_STEP_SCREEN,
        {
          contactStage: stage,
          contactId: otherId,
          organization: { id: orgId },
          contactName: otherName,
          createStepTracking: buildTrackingObj(
            'people : person : steps : create',
            'people',
            'person',
            'steps',
          ),
          trackingObj: buildTrackingObj(
            'people : person : steps : add',
            'people',
            'person',
            'steps',
          ),
        },
      );
    });
  });
});

describe('SelectMyStepScreen next', () => {
  beforeEach(() => {
    store = configureStore([thunk])(baseState);
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      SELECT_MY_STEP_SCREEN,
      {
        enableBackButton: true,
        contactStage: stage,
        organization: { id: orgId },
      },
      {},
    );

    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      CELEBRATION_SCREEN,
      {
        trackingObj: buildTrackingObj(
          `people : self : steps : gif`,
          'people',
          'self',
          'steps',
        ),
      },
    );
  });
});

describe('PersonSelectStepScreen next', () => {
  beforeEach(() => {
    store = configureStore([thunk])(baseState);
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      PERSON_SELECT_STEP_SCREEN,
      {
        contactStage: stage,
        contactId: otherId,
        organization: { id: orgId },
        contactName: otherName,
        createStepTracking: buildTrackingObj(
          'people : person : steps : create',
          'people',
          'person',
          'steps',
        ),
        trackingObj: buildTrackingObj(
          'people : person : steps : add',
          'people',
          'person',
          'steps',
        ),
      },
      {},
    );

    expect(navigationActions.navigatePush).toHaveBeenCalledWith(
      CELEBRATION_SCREEN,
      {
        trackingObj: buildTrackingObj(
          `people : person : steps : gif`,
          'people',
          'person',
          'steps',
        ),
      },
    );
  });
});

describe('CelebrationScreen next', () => {
  const popToTopResponse = { type: 'pop to top of stack' };
  const navigateBackResponse = { type: 'navigate back' };

  beforeEach(() => {
    beforeEach(() => {
      store = configureStore([thunk])(baseState);
    });
    reactNavigation.StackActions.popToTop = jest
      .fn()
      .mockReturnValue(popToTopResponse);
    navigationActions.navigateBack.mockReturnValue(navigateBackResponse);
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(CELEBRATION_SCREEN, {}, {});

    expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
    expect(navigationActions.navigateBack).toHaveBeenCalledTimes(1);
  });
});
