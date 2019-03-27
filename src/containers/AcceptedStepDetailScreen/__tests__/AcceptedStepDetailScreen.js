import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';
import { completeStep, deleteStepWithTracking } from '../../../actions/steps';
import { navigateBack } from '../../../actions/navigation';
import { reminderSelector } from '../../../selectors/stepReminders';

import AcceptedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/stepReminders');

const completeStepResult = { type: 'completed step' };
const deleteStepResult = { type: 'deleted step' };
const navigateBackResult = { type: 'navigate back' };

const stepId = '234242';
const reminderId = '1';
const reminder = { id: reminderId };
const stepReminders = {
  all: {
    [reminderId]: reminder,
  },
};

let step;
let challenge_suggestion;
let screen;

const mockStore = configureStore([thunk]);
let store;

completeStep.mockReturnValue(completeStepResult);
deleteStepWithTracking.mockReturnValue(deleteStepResult);
navigateBack.mockReturnValue(navigateBackResult);
reminderSelector.mockReturnValue(reminder);

beforeEach(() => {
  jest.clearAllMocks();
  store = mockStore();

  step = {
    id: stepId,
    title: 'ROBERT',
    challenge_suggestion,
  };

  store = mockStore({
    stepReminders,
  });

  screen = renderShallow(
    <AcceptedStepDetailScreen navigation={createMockNavState({ step })} />,
    store,
  );
});

it('selects reminder from Redux', () => {
  expect(reminderSelector).toHaveBeenCalledWith({ stepReminders }, { stepId });
});

describe('with challenge suggestion', () => {
  beforeAll(() => {
    challenge_suggestion = { description_markdown: 'roge rules' };
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  describe('bottomButtonProps', () => {
    it('completes step', () => {
      screen.props().bottomButtonProps.onPress();

      expect(completeStep).toHaveBeenCalledWith(step, 'Step Detail', true);
      expect(store.getActions()).toEqual([completeStepResult]);
    });
  });

  describe('remove step button', () => {
    it('deletes step', () => {
      screen.props().RightHeader.props.onPress();

      expect(deleteStepWithTracking).toHaveBeenCalledWith(step, 'Step Detail');
      expect(navigateBack).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        deleteStepResult,
        navigateBackResult,
      ]);
    });
  });
});

describe('without challenge suggestion', () => {
  beforeAll(() => {
    challenge_suggestion = null;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});
