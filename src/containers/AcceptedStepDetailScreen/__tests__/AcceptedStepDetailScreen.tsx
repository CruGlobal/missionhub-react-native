import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';
import { completeStep, deleteStepWithTracking } from '../../../actions/steps';
import { removeStepReminder } from '../../../actions/stepReminders';
import { navigateBack } from '../../../actions/navigation';
import { reminderSelector } from '../../../selectors/stepReminders';

import AcceptedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/stepReminders');

const completeStepResult = { type: 'completed step' };
const deleteStepResult = { type: 'deleted step' };
const removeReminderResult = { type: 'remove reminder' };
const navigateBackResult = { type: 'navigate back' };

const stepId = '234242';
const reminderId = '1';
const reminder = { id: reminderId };
const stepReminders = {
  all: {
    [reminderId]: reminder,
  },
};

let step: any;
let challenge_suggestion: any;
let screen: any;

const mockStore = configureStore([thunk]);
let store: any;

((completeStep as unknown) as jest.Mock).mockReturnValue(completeStepResult);
((deleteStepWithTracking as unknown) as jest.Mock).mockReturnValue(
  deleteStepResult,
);
((removeStepReminder as unknown) as jest.Mock).mockReturnValue(
  removeReminderResult,
);
((navigateBack as unknown) as jest.Mock).mockReturnValue(navigateBackResult);
((reminderSelector as unknown) as jest.Mock).mockReturnValue(reminder);

beforeEach(() => {
  jest.clearAllMocks();
  store = mockStore();

  step = {
    id: stepId,
    title: 'ROBERT',
    challenge_suggestion,
    receiver: {
      first_name: 'Christian',
    },
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

describe('without reminder', () => {
  beforeAll(() => {
    ((reminderSelector as unknown) as jest.Mock).mockReturnValue(undefined);
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('with challenge suggestion', () => {
  beforeAll(() => {
    ((reminderSelector as unknown) as jest.Mock).mockReturnValue(reminder);
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
    ((reminderSelector as unknown) as jest.Mock).mockReturnValue(reminder);
    challenge_suggestion = null;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('handleRemoveReminder', () => {
  let centerContent;

  beforeAll(() => {
    ((reminderSelector as unknown) as jest.Mock).mockReturnValue(reminder);
  });

  beforeEach(() => {
    centerContent = renderShallow(screen.props().CenterContent, store);
    centerContent
      .childAt(0)
      .childAt(1)
      .props()
      .onPress();
  });

  it('removes reminder', () => {
    expect(removeStepReminder).toHaveBeenCalledWith(stepId);
  });
});
