import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import JourneyItem from '../src/components/JourneyItem';
import { testSnapshot } from '../testUtils';

const date = '2017-12-06T14:24:52Z';
const mockStep = {
  id: '123',
  text: 'Test Journey',
  completed_at: date,
};

it('renders correctly', () => {
  testSnapshot(
    <JourneyItem item={mockStep} type="step" />
  );
});
