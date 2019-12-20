import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { completeStep, deleteStepWithTracking } from '../../../actions/steps';
import { removeStepReminder } from '../../../actions/stepReminders';
import { navigateBack } from '../../../actions/navigation';
import { reminderSelector } from '../../../selectors/stepReminders';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import AcceptedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/stepReminders');
jest.mock('../../../components/ReminderButton', () => 'ReminderButton');
jest.mock('../../../components/ReminderDateText', () => 'ReminderDateText');
jest.mock('../../../utils/hooks/useAnalytics');

const stepId = '234242';
const reminderId = '1';
const reminder = { id: reminderId };
const challenge_suggestion = { description_markdown: 'roge rules' };
const stepReminders = {
  all: {
    [reminderId]: reminder,
  },
};

const step = {
  id: stepId,
  title: 'ROBERT',
  challenge_suggestion,
  receiver: {
    first_name: 'Christian',
  },
};

const completeStepResult = { type: 'completed step' };
const deleteStepResult = { type: 'deleted step' };
const removeReminderResult = { type: 'remove reminder' };
const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  (completeStep as jest.Mock).mockReturnValue(completeStepResult);
  (deleteStepWithTracking as jest.Mock).mockReturnValue(deleteStepResult);
  (removeStepReminder as jest.Mock).mockReturnValue(removeReminderResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  ((reminderSelector as unknown) as jest.Mock).mockReturnValue(reminder);
});

describe('without description, without reminder', () => {
  it('renders correctly', () => {
    ((reminderSelector as unknown) as jest.Mock).mockReturnValue(undefined);

    renderWithContext(<AcceptedStepDetailScreen />, {
      initialState: { stepReminders },
      navParams: { step: { ...step, challenge_suggestion: {} } },
    }).snapshot();

    expect(reminderSelector).toHaveBeenCalledWith(
      { stepReminders },
      { stepId },
    );
    expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'active step']);
  });
});

describe('with description, without reminder', () => {
  it('renders correctly', () => {
    ((reminderSelector as unknown) as jest.Mock).mockReturnValue(undefined);

    renderWithContext(<AcceptedStepDetailScreen />, {
      initialState: { stepReminders },
      navParams: { step },
    }).snapshot();

    expect(reminderSelector).toHaveBeenCalledWith(
      { stepReminders },
      { stepId },
    );
  });
});

describe('with description, with reminder', () => {
  it('renders correctly', () => {
    renderWithContext(<AcceptedStepDetailScreen />, {
      initialState: { stepReminders },
      navParams: { step },
    }).snapshot();

    expect(reminderSelector).toHaveBeenCalledWith(
      { stepReminders },
      { stepId },
    );
  });
});

it('completes step', () => {
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      initialState: { stepReminders },
      navParams: { step },
    },
  );

  fireEvent.press(getByTestId('bottomButton'));

  expect(completeStep).toHaveBeenCalledWith(step, 'Step Detail', true);
  expect(store.getActions()).toEqual([completeStepResult]);
});

it('deletes step', () => {
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      initialState: { stepReminders },
      navParams: { step },
    },
  );

  fireEvent.press(getByTestId('removeStepButton'));

  expect(deleteStepWithTracking).toHaveBeenCalledWith(step, 'Step Detail');
  expect(navigateBack).toHaveBeenCalled();
  expect(store.getActions()).toEqual([deleteStepResult, navigateBackResult]);
});

it('deletes reminder', () => {
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      initialState: { stepReminders },
      navParams: { step },
    },
  );

  fireEvent.press(getByTestId('removeReminderButton'));

  expect(removeStepReminder).toHaveBeenCalledWith(stepId);
  expect(store.getActions()).toEqual([removeReminderResult]);
});
