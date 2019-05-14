import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { renderShallow } from '../../../../testUtils';
import { AddPersonFlowScreens } from '../addPersonFlow';
import { paramsForStageNavigation } from '../../utils';
import { buildTrackingObj } from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';

jest.mock('../../../actions/navigation');
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
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };
const flowCompleteResponse = { type: 'on flow complete' };

beforeEach(() => {
  store.clearActions();
  navigatePush.mockReturnValue(navigatePushResponse);
  paramsForStageNavigation.mockReturnValue({
    assignment: reverseContactAssignment,
    name: contactName,
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
      expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
        addingContactFlow: true,
        enableBackButton: false,
        currentStage: null,
        name: contactName,
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
      expect(onFlowComplete).toHaveBeenCalledWith({ orgId });
      expect(store.getActions()).toEqual([flowCompleteResponse]);
    });
  });
});

describe('PersonStageScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      PERSON_STAGE_SCREEN,
      {},
      { stage, name: contactName, contactId, orgId },
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
      enableBackButton: false,
      enableSkipButton: true,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('PersonStageScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      PERSON_STAGE_SCREEN,
      {},
      { stage, name: contactName, contactId, orgId },
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
      enableBackButton: false,
      enableSkipButton: true,
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('PersonSelectStepScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      PERSON_SELECT_STEP_SCREEN,
      { createStepTracking: {} },
      { orgId },
    );
  });

  it('should fire required next actions', () => {
    expect(onFlowComplete).toHaveBeenCalledWith({ orgId });
    expect(store.getActions()).toEqual([flowCompleteResponse]);
  });
});
