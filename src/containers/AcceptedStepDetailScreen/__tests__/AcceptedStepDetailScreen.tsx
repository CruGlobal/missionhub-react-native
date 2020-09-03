import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import {
  handleAfterCompleteStep,
  removeFromStepsList,
} from '../../../actions/steps';
import { navigateBack } from '../../../actions/navigation';
import { updatePersonGQL } from '../../../actions/person';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { AcceptedStepDetail_step_receiver } from '../__generated__/AcceptedStepDetail';
import {
  DELETE_STEP_MUTATION,
  DELETE_STEP_REMINDER_MUTATION,
  COMPLETE_STEP_MUTATION,
} from '../queries';
import { trackStepDeleted } from '../../../actions/analytics';
import AcceptedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../actions/analytics');
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

const handleAfterCompleteStepResult = { type: 'handle after completed step' };
const trackStepDeletedResult = { type: 'track deleted step' };
const navigateBackResult = { type: 'navigate back' };

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  (handleAfterCompleteStep as jest.Mock).mockReturnValue(
    handleAfterCompleteStepResult,
  );
  (trackStepDeleted as jest.Mock).mockReturnValue(trackStepDeletedResult);
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
  const communityId = '1234';

  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      initialState,
      navParams: { stepId, personId: otherId },
      mocks: {
        Step: () => ({
          id: stepId,
          receiver: { id: otherId, fullName: 'Christian Huffman' },
          community: { id: communityId },
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('bottomButton'));
  expect(useMutation).toHaveBeenMutatedWith(COMPLETE_STEP_MUTATION, {
    variables: { input: { id: stepId } },
  });
  await flushMicrotasksQueue();

  expect(handleAfterCompleteStep).toHaveBeenCalledWith(
    {
      id: stepId,
      receiver: {
        __typename: 'Person',
        id: otherId,
        fullName: 'Christian Huffman',
      },
      community: { __typename: 'Community', id: communityId },
    },
    'Step Detail',
    true,
  );
  expect(updatePersonGQL).toHaveBeenCalledWith(otherId);

  expect(store.getActions()).toEqual([handleAfterCompleteStepResult]);
});

it('should delete step', async () => {
  const stepId = '9';
  const { getByTestId, store } = renderWithContext(
    <AcceptedStepDetailScreen />,
    {
      initialState,
      navParams: { stepId, personId: otherId },
      mocks: {
        Step: () => ({
          id: stepId,
          receiver: () => ({
            id: otherId,
          }),
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('removeStepButton'));
  expect(useMutation).toHaveBeenMutatedWith(DELETE_STEP_MUTATION, {
    variables: { input: { id: stepId } },
  });
  await flushMicrotasksQueue();

  expect(trackStepDeleted).toHaveBeenCalledWith('Step Detail');
  expect(removeFromStepsList).toHaveBeenCalledWith(stepId, otherId);
  expect(navigateBack).toHaveBeenCalled();
  expect(updatePersonGQL).toHaveBeenCalledWith(otherId);
  expect(store.getActions()).toEqual([
    navigateBackResult,
    trackStepDeletedResult,
  ]);
});

it('should delete reminder', async () => {
  const reminderId = '1234';
  const { getByTestId } = renderWithContext(<AcceptedStepDetailScreen />, {
    initialState,
    navParams: { stepId, personId: otherId },
    mocks: {
      Step: () => ({
        id: stepId,
        post: null,
        reminder: () => ({
          id: reminderId,
        }),
      }),
    },
  });

  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('removeReminderButton'));
  expect(useMutation).toHaveBeenMutatedWith(DELETE_STEP_REMINDER_MUTATION, {
    variables: { input: { id: reminderId } },
  });
});
