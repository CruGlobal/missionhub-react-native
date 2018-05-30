import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import StepsList from '../../src/components/StepsList/index';
import { testSnapshot } from '../../testUtils/index';

const items = [
  { id: '1', body: 'I feel great', selected: true },
  { id: '2', body: 'I feel wonderful', selected: false },
];

it('renders correctly', () => {
  testSnapshot(
    <StepsList
      items={items}
      createStepText="Create your own step..."
      loadMoreStepsText="load more steps"
      onSelectStep={() => {}}
      onCreateStep={() => {}}
      onLoadMoreSteps={() => {}}
    />,
  );
});
