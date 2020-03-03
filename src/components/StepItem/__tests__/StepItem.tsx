import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { StepItem as Step } from '../__generated__/StepItem';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { STEP_ITEM_FRAGMENT } from '../queries';

import StepItem from '..';

jest.mock('../../ReminderButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/ReminderButton'),
  default: 'ReminderButton',
}));

const mockStep = mockFragment<Step>(STEP_ITEM_FRAGMENT);

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

it('renders with pressable name correctly', () => {
  renderWithContext(<StepItem step={mockStep} onPressName={jest.fn()} />, {
    initialState,
  }).snapshot();
});

describe('step item methods receiver', () => {
  const mockSelect = jest.fn();
  const mockPressName = jest.fn();
  function getComponent() {
    return renderWithContext(
      <StepItem
        step={mockStep}
        onSelect={mockSelect}
        onPressName={mockPressName}
      />,
      { initialState },
    );
  }

  it('handles select', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemCard'));
    expect(mockSelect).toHaveBeenCalledWith(mockStep);
  });
  it('handles press name', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemPersonButton'));
    expect(mockPressName).toHaveBeenCalledWith(mockStep);
  });
});
