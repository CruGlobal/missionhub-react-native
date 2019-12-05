import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';
import { StepItem as Step } from '../__generated__/StepItem';
import { mockFragment } from '../../../../testUtils/apolloMockClient';

import StepItem, { STEP_ITEM_FRAGMENT } from '..';

jest.mock('../../ReminderButton', () => 'ReminderButton');

const mockStep = mockFragment<Step>(STEP_ITEM_FRAGMENT);

const mockDate = '2019-10-17 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const stepId = '1';
const reminderId = '11';
const reminder = { id: reminderId };
const stepReminders = {
  allByStep: {
    [stepId]: reminder,
  },
};
const initialState = {
  auth: {
    person: {
      id: '1',
    },
  },
  stepReminders: stepReminders,
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
  renderWithContext(
    <StepItem step={mockStep} type="swipeable" onPressName={jest.fn()} />,
    { initialState },
  ).snapshot();
});

describe('step item methods with no receiver', () => {
  const mockSelect = jest.fn();
  const mockPressName = jest.fn();
  const step = { ...mockStep, receiver: undefined };
  function getComponent() {
    return renderWithContext(
      <StepItem
        step={step}
        onSelect={mockSelect}
        onPressName={mockPressName}
      />,
      { initialState },
    );
  }

  it('handles select', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemCard'));
    expect(mockSelect).toHaveBeenCalledTimes(0);
  });

  it('handles press name', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemPersonButton'));
    expect(mockPressName).not.toHaveBeenCalled();
  });
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
