import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

import { createMockStore, testSnapshot } from '../../testUtils';
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
    personId: '1',
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');


it('renders me correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepItem step={mockStep} />
    </Provider>
  );
});

it('renders not me correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepItem step={{
        ...mockStep,
        id: '2',
      }} />
    </Provider>
  );
});

it('renders type swipeable correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepItem step={mockStep} type="swipeable" />
    </Provider>
  );
});

it('renders type contact correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepItem step={mockStep} type="contact" />
    </Provider>
  );
});

it('renders type reminder correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepItem step={mockStep} type="reminder" />
    </Provider>
  );
});

it('renders type action correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <StepItem step={mockStep} type="swipeable" onAction={() => {}} />
    </Provider>
  );
});

it('renders hover for step', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <StepItem step={mockStep} type="swipeable" onAction={() => { }} />,
    { context: { store } },
  );
  screen.setState({ hovering: true });
  expect(screen.dive()).toMatchSnapshot();
});
