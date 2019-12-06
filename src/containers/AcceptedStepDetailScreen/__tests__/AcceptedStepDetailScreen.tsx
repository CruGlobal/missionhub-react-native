import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { completeStep, deleteStepWithTracking } from '../../../actions/steps';
import { removeStepReminder } from '../../../actions/stepReminders';
import { navigateBack } from '../../../actions/navigation';

import AcceptedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../actions/navigation');
jest.mock('../../../components/ReminderButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/ReminderButton'),
  default: 'ReminderButton',
}));
jest.mock('../../../components/ReminderDateText', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/ReminderDateText'),
  default: 'ReminderDateText',
}));

const stepId = '234242';

const completeStepResult = { type: 'completed step' };
const deleteStepResult = { type: 'deleted step' };
const removeReminderResult = { type: 'remove reminder' };
const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  (completeStep as jest.Mock).mockReturnValue(completeStepResult);
  (deleteStepWithTracking as jest.Mock).mockReturnValue(deleteStepResult);
  (removeStepReminder as jest.Mock).mockReturnValue(removeReminderResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('should render correctly while loading', () => {
  renderWithContext(<AcceptedStepDetailScreen />, {
    navParams: { stepId },
    mocks: {
      Step: () => ({ reminder: null, stepSuggestion: null }),
    },
  }).snapshot();
});

it('should render correctly without description and without reminder', async () => {
  const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
    navParams: { stepId },
    mocks: {
      Step: () => ({ reminder: null, stepSuggestion: null }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
});

describe('with description, without reminder', () => {
  it('should render correctly', async () => {
    const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
      navParams: { stepId },
      mocks: {
        Step: () => ({ reminder: null }),
      },
    });
    await flushMicrotasksQueue();
    snapshot();
  });
});

describe('with description, with reminder', () => {
  it('should render correctly', async () => {
    const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
      navParams: { stepId },
    });
    await flushMicrotasksQueue();
    snapshot();
  });
});

it('should complete step', async () => {
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      navParams: { stepId },
    },
  );

  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('bottomButton'));

  expect((completeStep as jest.Mock).mock.calls[0]).toMatchSnapshot();
  expect(store.getActions()).toEqual([completeStepResult]);
});

it('should delete step', async () => {
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      navParams: { stepId },
    },
  );

  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('removeStepButton'));

  expect((deleteStepWithTracking as jest.Mock).mock.calls[0]).toMatchSnapshot();
  expect(navigateBack).toHaveBeenCalled();
  expect(store.getActions()).toEqual([deleteStepResult, navigateBackResult]);
});

it('should delete reminder', async () => {
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      navParams: { stepId },
      mocks: {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        Step: (_: any, context: any) => ({
          id: context.id,
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('removeReminderButton'));

  expect(removeStepReminder).toHaveBeenCalledWith(stepId);
  expect(store.getActions()).toEqual([removeReminderResult]);
});
