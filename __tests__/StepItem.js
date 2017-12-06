import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import StepItem from '../src/components/StepItem';
import { testSnapshot } from '../testUtils';

const date = '2017-12-06T14:24:52Z';
const mockStep = {
  id: '123',
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

it('renders correctly', () => {
  testSnapshot(
    <StepItem step={mockStep} />
  );
});

it('renders me correctly', () => {
  testSnapshot(
    <StepItem step={mockStep} isMe={true} />
  );
});

it('renders type draggable correctly', () => {
  testSnapshot(
    <StepItem step={mockStep} type="draggable" />
  );
});

it('renders type dragging correctly', () => {
  testSnapshot(
    <StepItem step={mockStep} type="dragging" />
  );
});

it('renders type swipeable correctly', () => {
  testSnapshot(
    <StepItem step={mockStep} type="swipeable" />
  );
});

it('renders type offscreen correctly', () => {
  testSnapshot(
    <StepItem step={mockStep} type="offscreen" />
  );
});
