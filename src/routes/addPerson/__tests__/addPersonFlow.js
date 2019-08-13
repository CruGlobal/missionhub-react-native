import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { CREATE_STEP } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { AddPersonFlowScreens } from '../addPersonFlow';
import { paramsForStageNavigation } from '../../utils';
import { buildTrackingObj } from '../../../utils/common';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { createCustomStep } from '../../../actions/steps';
import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { SELECT_PERSON_STAGE_SCREEN } from '../../../containers/SelectPersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../utils');

const myId = '111';
const contactId = '222';
const contactName = 'Other';
const orgId = '123';
const contactAssignmentId = '22';

const stage = { id: '1234' };
const contact = {
  id: contactId,
};
const reverseContactAssignment = {
  id: contactAssignmentId,
};
const stepText = 'Step';
const step = { id: '567', title: stepText };
const trackingObj = buildTrackingObj(
  'people : person : steps : create',
  'people',
  'person',
  'steps',
);

const onFlowComplete = jest.fn();

const store = configureStore([thunk])({
  auth: {
    person: {
      id: myId,
    },
  },
  personProfile: {
    id: contactId,
    personFirstName: contactName,
  },
});

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = AddPersonFlowScreens(onFlowComplete)[screen];

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
const navigateBackResponse = { type: 'navigate back' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };
const flowCompleteResponse = { type: 'on flow complete' };
const createCustomStepResponse = { type: 'create custom step' };

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(navigatePushResponse);
  navigateBack.mockReturnValue(navigateBackResponse);
  createCustomStep.mockReturnValue(createCustomStepResponse);
  paramsForStageNavigation.mockReturnValue({
    assignment: reverseContactAssignment,
    firstName: contactName,
  });
  reactNavigation.StackActions.popToTop = jest
    .fn()
    .mockReturnValue(popToTopResponse);
  reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);
});

describe('AddStepScreen next', () => {
  let didSavePerson;

  beforeEach(async () => {
    await buildAndCallNext(
      ADD_CONTACT_SCREEN,
      {},
      { person: contact, orgId, didSavePerson },
    );
  });

  describe('did save person', () => {
    beforeAll(() => {
      didSavePerson = true;
      onFlowComplete.mockReturnValue(flowCompleteResponse);
    });

    it('should fire required next actions', () => {
      expect(paramsForStageNavigation).toHaveBeenCalledWith(
        contactId,
        orgId,
        store.getState,
      );
      expect(navigatePush).toHaveBeenCalledWith(SELECT_PERSON_STAGE_SCREEN, {
        enableBackButton: false,
        firstName: contactName,
        contactId,
        contactAssignmentId,
        section: 'people',
        subsection: 'person',
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('did not save person', () => {
    beforeAll(() => {
      didSavePerson = false;
    });

    it('should fire required next actions', () => {
      expect(paramsForStageNavigation).not.toHaveBeenCalled();
      expect(navigatePush).not.toHaveBeenCalled();
      expect(navigateBack).toHaveBeenCalledWith();
      expect(store.getActions()).toEqual([navigateBackResponse]);
    });
  });
});

describe('PersonStageScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      SELECT_PERSON_STAGE_SCREEN,
      {},
      { stage, firstName: contactName, contactId, orgId },
    );
  });

  it('should fire required next actions', () => {
    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      contactStage: stage,
      createStepTracking: buildTrackingObj(
        'people : person : steps : create',
        'people',
        'person',
        'steps',
      ),
      contactName,
      contactId,
      organization: { id: orgId },
      enableSkipButton: true,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('PersonStageScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      SELECT_PERSON_STAGE_SCREEN,
      {},
      { stage, firstName: contactName, contactId, orgId },
    );
  });

  it('should fire required next actions', () => {
    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      contactStage: stage,
      createStepTracking: buildTrackingObj(
        'people : person : steps : create',
        'people',
        'person',
        'steps',
      ),
      contactName,
      contactId,
      organization: { id: orgId },
      enableSkipButton: true,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('PersonSelectStepScreen next', () => {
  describe('select a suggested step', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        PERSON_SELECT_STEP_SCREEN,
        {},
        { receiverId: contactId, step, orgId },
      );
    });

    it('should fire required next actions', () => {
      expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
        receiverId: contactId,
        step,
        orgId,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('create a step', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        PERSON_SELECT_STEP_SCREEN,
        {},
        { receiverId: contactId, step: undefined, orgId },
      );
    });

    it('should fire required next actions', () => {
      expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        personId: contactId,
        orgId,
        trackingObj,
      });
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      SUGGESTED_STEP_DETAIL_SCREEN,
      { receiverId: contactId, step, orgId },
      { orgId },
    );
  });

  it('should fire required next actions', () => {
    expect(onFlowComplete).toHaveBeenCalledWith({ orgId });
    expect(store.getActions()).toEqual([flowCompleteResponse]);
  });
});

describe('AddStepScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        type: CREATE_STEP,
        personId: contactId,
        orgId,
        trackingObj,
      },
      { text: stepText, personId: contactId, orgId },
    );
  });

  it('should fire required next actions', () => {
    expect(createCustomStep).toHaveBeenCalledWith(stepText, contactId, orgId);
    expect(onFlowComplete).toHaveBeenCalledWith({ orgId });
    expect(store.getActions()).toEqual([
      createCustomStepResponse,
      flowCompleteResponse,
    ]);
  });
});
