import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  testSnapshotShallow,
  createMockNavState,
  renderShallow,
} from '../../../../testUtils';
import { STEP_SUGGESTION, ACCEPTED_STEP } from '../../../constants';
import { completeStep, addSteps } from '../../../actions/steps';

import StepDetailScreen from '..';

jest.mock('../../../actions/steps');

const baseStep = {
  id: 1,
  title: 'Step of Faith',
};

const suggestedStep = {
  ...baseStep,
  _type: STEP_SUGGESTION,
};

const suggestedStepWithTip = {
  ...suggestedStep,
  description_markdown: 'Suggested Step Tip',
};

const acceptedStep = {
  ...baseStep,
  _type: ACCEPTED_STEP,
};

const acceptedStepWithTip = {
  ...acceptedStep,
  challenge_suggestion: {
    description_markdown: 'Accepted Step Tip',
  },
};

const completedStep = {
  ...acceptedStep,
  completed_at: '2-13-2019',
};

const receiverId = '4242413';
const orgId = '99990002';

const mockStore = configureStore([thunk]);
let store;
let nav;

const completeStepResult = { type: 'completed step' };
const addStepResult = { type: 'add step result' };

const props = { receiverId, orgId };

const componentAcceptedStep = (
  <StepDetailScreen
    navigation={createMockNavState({ step: acceptedStep, ...props })}
  />
);
const componentSuggestedStep = (
  <StepDetailScreen
    navigation={createMockNavState({ step: suggestedStep, ...props })}
  />
);

completeStep.mockReturnValue(completeStepResult);
addSteps.mockReturnValue(addStepResult);

beforeEach(() => {
  store = mockStore();
  jest.clearAllMocks();
});

describe('render', () => {
  it('renders for suggested step', () => {
    testSnapshotShallow(componentSuggestedStep, store);
  });

  it('renders for suggested step with tip', () => {
    nav = createMockNavState({ step: suggestedStepWithTip, ...props });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });

  it('renders for accepted step', () => {
    testSnapshotShallow(componentAcceptedStep, store);
  });

  it('renders for accepted step with tip', () => {
    nav = createMockNavState({ step: acceptedStepWithTip, ...props });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });

  it('renders for completed step', () => {
    nav = createMockNavState({ step: completedStep, ...props });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });
});

describe('complete step button', () => {
  it('creates step', () => {
    renderShallow(componentAcceptedStep, store)
      .childAt(4)
      .props()
      .onPress();

    expect(completeStep).toHaveBeenCalledWith(acceptedStep, 'Step Detail');
    expect(store.getActions()).toEqual([completeStepResult]);
  });
});

describe('add step button', () => {
  it('adds step', () => {
    renderShallow(componentSuggestedStep, store)
      .childAt(4)
      .props()
      .onPress();

    expect(addSteps).toHaveBeenCalledWith([suggestedStep], receiverId, {
      id: orgId,
    });
    expect(store.getActions()).toEqual([addStepResult]);
  });
});
