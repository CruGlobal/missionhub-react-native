import React from 'react';

import {
  createThunkStore,
  renderShallow,
  testSnapshotShallow,
} from '../../../../testUtils';

import StepItem from '..';

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
  receiver: { id: '456' },
};

const mockState = {
  auth: {
    person: {
      id: '1',
    },
  },
};

const store = createThunkStore(mockState);

jest.mock('react-native-device-info');

it('renders me correctly', () => {
  testSnapshotShallow(<StepItem step={mockStep} />, store);
});

it('renders not me correctly', () => {
  testSnapshotShallow(
    <StepItem
      step={{
        ...mockStep,
        id: '2',
      }}
    />,
    store,
  );
});

it('renders type swipeable correctly', () => {
  testSnapshotShallow(<StepItem step={mockStep} type="swipeable" />, store);
});

it('renders type contact correctly', () => {
  testSnapshotShallow(<StepItem step={mockStep} type="contact" />, store);
});

it('renders type reminder correctly', () => {
  testSnapshotShallow(<StepItem step={mockStep} type="reminder" />, store);
});

it('renders type action correctly', () => {
  testSnapshotShallow(
    <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
    store,
  );
});

it('renders hover for step', () => {
  const component = renderShallow(
    <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
    store,
  );
  component.setState({ hovering: true });
  expect(component).toMatchSnapshot();
});

describe('step item animations', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(
      <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
      store,
    );
  });
  it('renders animation fade in', () => {
    component.setState({ animation: 'fadeInRight' });
    component.update();
    expect(component).toMatchSnapshot();
  });
  it('renders animation fade out', () => {
    component.setState({ animation: 'fadeOutRight' });
    component.update();
    expect(component).toMatchSnapshot();
  });
  it('renders no animation', () => {
    component.setState({ animation: '' });
    component.update();
    expect(component).toMatchSnapshot();
  });
  it('changes animation to fade out', () => {
    component.setProps({ hideAction: true });
    expect(component.instance().state.animation).toEqual('fadeOutRight');
  });
  it('changes animation to fade in', () => {
    component.setProps({ hideAction: false });
    expect(component.instance().state.animation).toEqual('fadeInRight');
  });
});

it('renders no initial animation', () => {
  const component = renderShallow(
    <StepItem
      step={mockStep}
      type="swipeable"
      hideAction={true}
      onAction={jest.fn()}
    />,
    store,
  );
  expect(component).toMatchSnapshot();
});

describe('step item methods', () => {
  let component;
  const mockSelect = jest.fn();
  const mockAction = jest.fn();
  const step = { ...mockStep, receiver: null };
  beforeEach(() => {
    component = renderShallow(
      <StepItem
        step={step}
        onSelect={mockSelect}
        type="swipeable"
        onAction={mockAction}
      />,
      store,
    );
  });

  it('handles select with no receiver', () => {
    component.props().onPress();
    expect(mockSelect).toHaveBeenCalledTimes(0);
  });

  it('handles action press', () => {
    component
      .childAt(0)
      .childAt(1)
      .props()
      .onPress();
    expect(mockAction).toHaveBeenCalledWith(step);
  });
});
