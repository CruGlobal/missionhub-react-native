import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { PEOPLE_TAB } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { AddPersonFlowScreens } from '../addPersonFlow';
import { paramsForStageNavigation } from '../../utils';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../utils');

const myId = '111';
const contactId = '222';
const myName = 'Me';
const contactName = 'Other';
const stepId = '11';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const contact = {
  id: contactId,
};
const reverseContactAssignment = {
  id: contactAssignmentId,
};

let onFlowComplete = jest.fn();

let store = configureStore([thunk])();

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
    store = configureStore([thunk])();
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
