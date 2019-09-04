import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import StepItem, { StepItemProps } from '..';

const date = '2017-12-06T14:24:52Z';
const mockStep = {
  id: '1',
  title: 'Test Step',
  accepted_at: date,
  completed_at: date,
  created_at: date,
  updated_at: date,
  notified_at: date,
  note: 'Note',
  owner: { id: '456' },
  receiver: { id: '456', full_name: 'Receiver Name' },
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

it('renders type swipeable correctly', () => {
  renderWithContext(<StepItem step={mockStep} type="swipeable" />, {
    initialState,
  }).snapshot();
});

it('renders type contact correctly', () => {
  renderWithContext(<StepItem step={mockStep} type="contact" />, {
    initialState,
  }).snapshot();
});

it('renders type reminder correctly', () => {
  renderWithContext(<StepItem step={mockStep} type="reminder" />, {
    initialState,
  }).snapshot();
});

it('renders type action correctly', () => {
  renderWithContext(
    <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
    { initialState },
  ).snapshot();
});

it('renders hover for step', () => {
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
    { initialState },
  );
  recordSnapshot();
  fireEvent(getByTestId('StepItemIconButton'), 'onPressIn');
  diffSnapshot();
});

describe('step item animations', () => {
  const props: StepItemProps = {
    step: mockStep,
    type: 'swipeable',
    onAction: jest.fn(),
  };
  function getComponent(moreProps = {}) {
    return renderWithContext(<StepItem {...props} {...moreProps} />, {
      initialState,
    });
  }

  it('renders animation fade in', () => {
    const component = getComponent({ hideAction: true });
    component.recordSnapshot();
    component.rerender(<StepItem {...props} hideAction={false} />);
    component.diffSnapshot();
  });
  it('renders animation fade out', () => {
    // Doesn't render animation on first mount, must change props and rerender
    const component = getComponent({ hideAction: true });
    component.recordSnapshot();
    component.rerender(<StepItem {...props} hideAction={false} />);
    component.rerender(<StepItem {...props} hideAction={true} />);
    component.diffSnapshot();
  });
  it('renders no animation', () => {
    getComponent({ hideAction: false }).snapshot();
  });
  it('changes animation to fade out', () => {
    const component = getComponent({ hideAction: false });
    component.recordSnapshot();
    component.rerender(<StepItem {...props} hideAction={true} />);
    component.diffSnapshot();
  });
});

describe('step item methods', () => {
  const mockSelect = jest.fn();
  const mockAction = jest.fn();
  const step = { ...mockStep, receiver: undefined };
  function getComponent() {
    return renderWithContext(
      <StepItem
        step={step}
        onSelect={mockSelect}
        type="swipeable"
        onAction={mockAction}
      />,
      { initialState },
    );
  }

  it('handles select with no receiver', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemButton'));
    expect(mockSelect).toHaveBeenCalledTimes(0);
  });

  it('handles action press', () => {
    const { getByTestId } = getComponent();
    fireEvent.press(getByTestId('StepItemIconButton'));
    expect(mockAction).toHaveBeenCalledWith(step);
  });
});
