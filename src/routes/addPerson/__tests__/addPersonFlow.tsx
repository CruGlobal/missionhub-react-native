import React from 'react';
import * as reactNavigation from 'react-navigation';

import { CREATE_STEP } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { AddPersonFlowScreens } from '../addPersonFlow';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { createCustomStep } from '../../../actions/steps';
import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { SELECT_STEP_SCREEN } from '../../../containers/SelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'navigate push' })),
  navigateBack: jest.fn(() => ({ type: 'navigate back' })),
}));
jest.mock('../../../actions/steps', () => ({
  getStepSuggestions: jest.fn(() => ({
    type: 'getStepSuggestions',
  })),
  createCustomStep: jest.fn(() => ({
    type: 'createCustomStep',
  })),
}));
jest.mock('../../utils');
jest.mock('../../../utils/hooks/useAnalytics');

const myId = '111';
const personId = '222';
const contactName = 'Other';
const orgId = '123';

const stage = { id: '1234' };
const contact = {
  id: personId,
};
const stepText = 'Step';
const step = { id: '567', title: stepText };

const onFlowComplete = jest.fn();

const initialState = {
  auth: {
    person: {
      id: myId,
    },
  },
  personId,
  people: {
    allByOrg: {
      [orgId]: {
        id: orgId,
        people: {
          [personId]: {
            id: personId,
            first_name: contactName,
          },
        },
      },
    },
  },
  organizations: { all: [] },
  stages: { stages: [] },
  steps: { suggestedForOthers: { '3': [{ id: '1' }] } },
};

// @ts-ignore
const buildAndCallNext = async (screen, navParams, nextProps) => {
  // @ts-ignore
  const Component = AddPersonFlowScreens(onFlowComplete)[screen];

  const { store, getByType } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  // @ts-ignore
  await store.dispatch(getByType(Component).children[0].props.next(nextProps));
  return { store };
};

const navigatePushResponse = { type: 'navigate push' };
const navigateBackResponse = { type: 'navigate back' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };
const flowCompleteResponse = { type: 'on flow complete' };
const getStepSuggestionsResponse = { type: 'getStepSuggestions' };
const createCustomStepResponse = { type: 'createCustomStep' };

beforeEach(() => {
  reactNavigation.StackActions.popToTop = jest
    .fn()
    .mockReturnValue(popToTopResponse);
  reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);
});

describe('AddContactScreen next', () => {
  // @ts-ignore
  let didSavePerson;
  // @ts-ignore
  let store;

  beforeEach(async () => {
    ({ store } = await buildAndCallNext(
      ADD_CONTACT_SCREEN,
      {},
      // @ts-ignore
      { person: contact, orgId, didSavePerson },
    ));
  });

  describe('did save person', () => {
    beforeAll(() => {
      didSavePerson = true;
      onFlowComplete.mockReturnValue(flowCompleteResponse);
    });

    it('should fire required next actions', () => {
      expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
        enableBackButton: false,
        personId,
        section: 'people',
        subsection: 'person',
        orgId,
      });
      // @ts-ignore
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('did not save person', () => {
    beforeAll(() => {
      didSavePerson = false;
    });

    it('should fire required next actions', () => {
      expect(navigatePush).not.toHaveBeenCalled();
      expect(navigateBack).toHaveBeenCalledWith();
      // @ts-ignore
      expect(store.getActions()).toEqual([navigateBackResponse]);
    });
  });
});

describe('PersonStageScreen next', () => {
  it('should fire required next actions', async () => {
    const { store } = await buildAndCallNext(
      SELECT_STAGE_SCREEN,
      {},
      { stage, firstName: contactName, personId, orgId },
    );

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STEP_SCREEN, {
      personId,
      orgId,
      enableSkipButton: true,
    });
    expect(store.getActions()).toEqual([
      {
        data: {},
        query: {
          include: 'localized_pathway_stages',
        },
        type: 'GET_STAGES_FETCH',
      },
      navigatePushResponse,
    ]);
  });
});

describe('SelectStepScreen next', () => {
  describe('select a suggested step', () => {
    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        SELECT_STEP_SCREEN,
        { personId, orgId },
        { personId, step, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
        personId,
        step,
        orgId,
      });
      expect(store.getActions()).toEqual([
        getStepSuggestionsResponse,
        navigatePushResponse,
      ]);
    });
  });

  describe('create a step', () => {
    it('should fire required next actions', async () => {
      const { store } = await buildAndCallNext(
        SELECT_STEP_SCREEN,
        { personId, orgId },
        { personId, step: undefined, orgId },
      );

      expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        personId,
        orgId,
      });
      expect(store.getActions()).toEqual([
        getStepSuggestionsResponse,
        navigatePushResponse,
      ]);
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  it('should fire required next actions', async () => {
    const { store } = await buildAndCallNext(
      SUGGESTED_STEP_DETAIL_SCREEN,
      { personId, step, orgId },
      { orgId },
    );

    expect(onFlowComplete).toHaveBeenCalledWith({ orgId });
    expect(store.getActions()).toEqual([flowCompleteResponse]);
  });
});

describe('AddStepScreen next', () => {
  it('should fire required next actions', async () => {
    const { store } = await buildAndCallNext(
      ADD_STEP_SCREEN,
      {
        type: CREATE_STEP,
        personId,
        orgId,
      },
      { text: stepText, personId, orgId },
    );

    expect(createCustomStep).toHaveBeenCalledWith(stepText, personId, orgId);
    expect(onFlowComplete).toHaveBeenCalledWith({ orgId });
    expect(store.getActions()).toEqual([
      createCustomStepResponse,
      flowCompleteResponse,
    ]);
  });
});
