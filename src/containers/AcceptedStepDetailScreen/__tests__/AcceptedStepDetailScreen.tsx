import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { completeStep, deleteStepWithTracking } from '../../../actions/steps';
import { removeStepReminder } from '../../../actions/stepReminders';
import { navigateBack } from '../../../actions/navigation';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { AcceptedStepDetail_step_receiver } from '../__generated__/AcceptedStepDetail';
import AcceptedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../actions/navigation');
jest.mock('../../../components/ReminderButton', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('../../../components/ReminderButton'),
  default: 'ReminderButton',
}));
jest.mock('../../../components/ReminderDateText', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('../../../components/ReminderDateText'),
  default: 'ReminderDateText',
}));
jest.mock('../../../utils/hooks/useAnalytics');

const myId = '4';
const otherId = '5';
const person: AcceptedStepDetail_step_receiver = {
  __typename: 'Person',
  id: myId,
  firstName: 'Christian',
};
const stepId = '234242';

const completeStepResult = { type: 'completed step' };
const deleteStepResult = { type: 'deleted step' };
const removeReminderResult = { type: 'remove reminder' };
const navigateBackResult = { type: 'navigate back' };

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  (completeStep as jest.Mock).mockReturnValue(completeStepResult);
  (deleteStepWithTracking as jest.Mock).mockReturnValue(deleteStepResult);
  (removeStepReminder as jest.Mock).mockReturnValue(removeReminderResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('should render correctly while loading', () => {
  renderWithContext(<AcceptedStepDetailScreen />, {
    initialState,
    navParams: { stepId, personId: myId },
    mocks: {
      Step: () => ({
        receiver: person,
        reminder: null,
        stepSuggestion: null,
        post: null,
      }),
    },
  }).snapshot();
});

it('should render correctly without description and without reminder for me', async () => {
  const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
    initialState,
    navParams: { stepId, personId: myId },
    mocks: {
      Step: () => ({
        receiver: { id: myId },
        reminder: null,
        stepSuggestion: null,
        post: null,
      }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'active step'], {
    assignmentType: { personId: myId },
  });
});

it('should render correctly without description and without reminder for other', async () => {
  const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
    initialState,
    navParams: { stepId, personId: otherId },
    mocks: {
      Step: () => ({
        receiver: { id: otherId },
        reminder: null,
        stepSuggestion: null,
        post: null,
      }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'active step'], {
    assignmentType: { personId: otherId },
  });
});

it('should render correctly post details', async () => {
  const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
    initialState,
    navParams: { stepId, personId: otherId },
    mocks: {
      Step: () => ({
        receiver: { id: otherId },
        reminder: null,
        stepSuggestion: null,
      }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'active step'], {
    assignmentType: { personId: otherId },
  });
});

describe('with description, without reminder', () => {
  it('should render correctly', async () => {
    const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
      initialState,
      navParams: { stepId, personId: otherId },
      mocks: {
        Step: () => ({ receiver: { id: otherId }, reminder: null, post: null }),
      },
    });
    await flushMicrotasksQueue();
    snapshot();
  });
});

describe('with description, with reminder', () => {
  it('should render correctly', async () => {
    const { snapshot } = renderWithContext(<AcceptedStepDetailScreen />, {
      initialState,
      navParams: { stepId, personId: otherId },
      mocks: {
        Step: () => ({ post: null }),
      },
    });
    await flushMicrotasksQueue();
    snapshot();
  });
});

it('should complete step', async () => {
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      initialState,
      navParams: { stepId, personId: otherId },
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
      initialState,
      navParams: { stepId, personId: otherId },
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
      initialState,
      navParams: { stepId, personId: otherId },
      mocks: {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        Step: (_: any, context: any) => ({
          id: context.id,
          post: null,
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('removeReminderButton'));

  expect(removeStepReminder).toHaveBeenCalledWith(stepId);
  expect(store.getActions()).toEqual([removeReminderResult]);
});
