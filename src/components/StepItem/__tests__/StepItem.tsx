import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { StepItem as Step } from '../__generated__/StepItem';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { STEP_ITEM_FRAGMENT } from '../queries';
import { navigatePush } from '../../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../../containers/AcceptedStepDetailScreen';
import { COMPLETED_STEP_DETAIL_SCREEN } from '../../../containers/CompletedStepDetailScreen';
import { navToPersonScreen } from '../../../actions/person';
import { completeStep } from '../../../actions/steps';
import { CONTACT_STEPS } from '../../../constants';

import StepItem from '..';

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigatePush' }),
}));
jest.mock('../../../actions/person', () => ({
  navToPersonScreen: jest.fn().mockReturnValue({ type: 'navToPersonScreen' }),
}));
jest.mock('../../../actions/steps', () => ({
  completeStep: jest.fn().mockReturnValue({ type: 'completeStep' }),
}));
jest.mock('../../ReminderButton', () => ({
  __esModule: true,
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
  renderWithContext(<StepItem step={mockStep} />, { initialState });
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
  });
});

it('renders hiding checkbox', () => {
  renderWithContext(<StepItem step={mockStep} showCheckbox={false} />, {
    initialState,
  });
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
  });
});

it('should navigate to person screen', () => {
  const { getByTestId } = renderWithContext(<StepItem step={mockStep} />, {
    initialState,
  });
  fireEvent.press(getByTestId('StepItemPersonButton'));
  expect(navToPersonScreen).toHaveBeenCalledWith(
    mockStep.receiver,
    mockStep.community,
  );
});

it('should complete steps with checkbox', () => {
  const { getByTestId } = renderWithContext(<StepItem step={mockStep} />, {
    initialState,
  });
  fireEvent.press(getByTestId('CompleteStepButton'));
  expect(completeStep).toHaveBeenCalledWith(mockStep, CONTACT_STEPS);
});
