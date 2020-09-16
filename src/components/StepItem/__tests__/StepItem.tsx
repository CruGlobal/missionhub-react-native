import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { StepItem as Step } from '../__generated__/StepItem';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { STEP_ITEM_FRAGMENT } from '../queries';
import { COMPLETE_STEP_MUTATION } from '../../../containers/AcceptedStepDetailScreen/queries';
import { navigatePush } from '../../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../../containers/AcceptedStepDetailScreen';
import { COMPLETED_STEP_DETAIL_SCREEN } from '../../../containers/CompletedStepDetailScreen';
import { navToPersonScreen, updatePersonGQL } from '../../../actions/person';
import { handleAfterCompleteStep } from '../../../actions/steps';
import { CONTACT_STEPS } from '../../../constants';
import StepItem from '..';

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigatePush' }),
}));
jest.mock('../../../actions/person', () => ({
  navToPersonScreen: jest.fn().mockReturnValue({ type: 'navToPersonScreen' }),
  updatePersonGQL: jest.fn(),
}));
jest.mock('../../../actions/steps', () => ({
  handleAfterCompleteStep: jest
    .fn()
    .mockReturnValue({ type: 'handleAfterCompleteStep' }),
}));
jest.mock('../../ReminderButton', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('../../../components/ReminderButton'),
  default: 'ReminderButton',
}));

const mockStep = {
  ...mockFragment<Step>(STEP_ITEM_FRAGMENT),
  completedAt: null,
};

const initialState = {
  auth: {
    person: {
      id: '1',
    },
  },
};

it('renders me correctly', () => {
  renderWithContext(<StepItem step={mockStep} />, { initialState }).snapshot();
});

it('renders not me correctly', () => {
  renderWithContext(
    <StepItem
      step={{
        ...mockStep,
        id: '2',
      }}
    />,
    { initialState },
  ).snapshot();
});

it('renders completed step', () => {
  renderWithContext(
    <StepItem
      step={{
        ...mockStep,
        completedAt: '2019-01-01',
      }}
    />,
    { initialState },
  ).snapshot();
});

it('renders hiding name', () => {
  renderWithContext(<StepItem step={mockStep} showName={false} />, {
    initialState,
  }).snapshot();
});

it('renders hiding checkbox', () => {
  renderWithContext(<StepItem step={mockStep} showCheckbox={false} />, {
    initialState,
  }).snapshot();
});

it('should navigate to accepted step detail screen', () => {
  const { getByTestId } = renderWithContext(
    <StepItem step={{ ...mockStep, completedAt: null }} />,
    {
      initialState,
    },
  );
  fireEvent.press(getByTestId('StepItemCard'));
  expect(navigatePush).toHaveBeenCalledWith(ACCEPTED_STEP_DETAIL_SCREEN, {
    stepId: mockStep.id,
    personId: mockStep.receiver.id,
  });
});

it('should navigate to completed step detail screen', () => {
  const { getByTestId } = renderWithContext(
    <StepItem step={{ ...mockStep, completedAt: '2019-01-01' }} />,
    {
      initialState,
    },
  );
  fireEvent.press(getByTestId('StepItemCard'));
  expect(navigatePush).toHaveBeenCalledWith(COMPLETED_STEP_DETAIL_SCREEN, {
    stepId: mockStep.id,
    personId: mockStep.receiver.id,
  });
});

it('should navigate to person screen', () => {
  const { getByTestId } = renderWithContext(<StepItem step={mockStep} />, {
    initialState,
  });
  fireEvent.press(getByTestId('StepItemPersonButton'));
  expect(navToPersonScreen).toHaveBeenCalledWith(mockStep.receiver.id);
});

it('should complete steps with checkbox', async () => {
  const { getByTestId } = renderWithContext(<StepItem step={mockStep} />, {
    initialState,
  });
  fireEvent.press(getByTestId('CompleteStepButton'));
  expect(useMutation).toHaveBeenMutatedWith(COMPLETE_STEP_MUTATION, {
    variables: { input: { id: mockStep.id } },
  });
  await flushMicrotasksQueue();
  expect(updatePersonGQL).toHaveBeenCalledWith(mockStep.receiver.id);
  expect(handleAfterCompleteStep).toHaveBeenCalledWith(
    {
      id: mockStep.id,
      receiver: { ...mockStep.receiver, __typename: 'Person' },
      community: {
        __typename: 'Community',
        ...mockStep.community,
      },
    },
    CONTACT_STEPS,
  );
});
