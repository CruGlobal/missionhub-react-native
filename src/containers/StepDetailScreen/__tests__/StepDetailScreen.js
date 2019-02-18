import React from 'react';

import {
  testSnapshotShallow,
  createMockNavState,
  createMockStore,
} from '../../../../testUtils';
import { STEP_SUGGESTION, ACCEPTED_STEP } from '../../../constants';

import StepDetailScreen from '..';

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

const store = createMockStore();
let nav;

describe('render', () => {
  it('renders for suggested step', () => {
    nav = createMockNavState({ step: suggestedStep });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });

  it('renders for suggested step with tip', () => {
    nav = createMockNavState({ step: suggestedStepWithTip });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });

  it('renders for accepted step', () => {
    nav = createMockNavState({ step: acceptedStep });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });

  it('renders for accepted step with tip', () => {
    nav = createMockNavState({ step: acceptedStepWithTip });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });

  it('renders for completed step', () => {
    nav = createMockNavState({ step: completedStep });
    testSnapshotShallow(<StepDetailScreen navigation={nav} />, store);
  });
});
