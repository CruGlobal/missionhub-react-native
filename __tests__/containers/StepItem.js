import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { createMockStore, renderShallow, testSnapshotShallow } from '../../testUtils';
import StepItem from '../../src/components/StepItem';

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

const store = createMockStore(mockState);

jest.mock('react-native-device-info');


it('renders me correctly', () => {
  testSnapshotShallow(
    <StepItem step={mockStep} />,
    store,
  );
});

it('renders not me correctly', () => {
  testSnapshotShallow(
    <StepItem step={{
      ...mockStep,
      id: '2',
    }} />,
    store,
  );
});

it('renders type swipeable correctly', () => {
  testSnapshotShallow(
    <StepItem step={mockStep} type="swipeable" />,
    store,
  );
});

it('renders type contact correctly', () => {
  testSnapshotShallow(
    <StepItem step={mockStep} type="contact" />,
    store,
  );
});

it('renders type reminder correctly', () => {
  testSnapshotShallow(
    <StepItem step={mockStep} type="reminder" />,
    store,
  );
});

it('renders type action correctly', () => {
  testSnapshotShallow(
    <StepItem step={mockStep} type="swipeable" onAction={() => {}} />,
    store,
  );
});

it('renders hover for step', () => {
  const component = renderShallow(
    <StepItem step={mockStep} type="swipeable" onAction={() => { }} />,
    store
  );
  component.setState({ hovering: true });
  expect(component).toMatchSnapshot();
});

describe('step item methods', () => {
  let component;
  const mockSelect = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <StepItem step={{ ...mockStep, receiver: null }} onSelect={mockSelect} type="swipeable" onAction={() => { }} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('handles create interaction', () => {
    component.handleSelect();
    expect(mockSelect).toHaveBeenCalledTimes(0);
  });


});
