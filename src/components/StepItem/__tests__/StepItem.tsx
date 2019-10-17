import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';

import StepItem from '..';

jest.mock('../../ReminderButton', () => 'ReminderButton');
const owner = { id: '456' };
const receiver = { id: '457', full_name: 'Receiver Name' };
const mockDate = '2019-10-17 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const mockStep = {
  id: '1',
  title: 'Test Step',
  accepted_at: mockDate,
  completed_at: mockDate,
  created_at: mockDate,
  updated_at: mockDate,
  notified_at: mockDate,
  note: 'Note',
  owner,
  receiver,
};
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

describe('step item methods with no receiver', () => {
  const mockSelect = jest.fn();
  const step = { ...mockStep, receiver: undefined };
  function getComponent() {
    return renderWithContext(<StepItem step={step} onSelect={mockSelect} />, {
      initialState,
    });
  }

  it('handles select', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemCard'));
    expect(mockSelect).toHaveBeenCalledTimes(0);
  });
});

describe('step item methods receiver', () => {
  const mockSelect = jest.fn();
  function getComponent() {
    return renderWithContext(
      <StepItem step={mockStep} onSelect={mockSelect} />,
      { initialState },
    );
  }

  it('handles select', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemCard'));
    expect(mockSelect).toHaveBeenCalledWith(mockStep);
  });
});
