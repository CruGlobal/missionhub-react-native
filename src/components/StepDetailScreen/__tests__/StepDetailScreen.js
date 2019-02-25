import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils/index';
import StepDetailScreen from '../index';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('bottomButtonProps are not null', () => {
  it('renders correctly', () => {
    testSnapshotShallow(
      <StepDetailScreen
        text="Roge is well behaved"
        CenterHeader={{ prop: 'center header' }}
        RightHeader={{ prop: 'right header' }}
        Body={null}
        bottomButtonProps={{ text: 'bottom button props', onPress: () => {} }}
      />,
    );
  });
});

describe('bottomButtonProps are null', () => {
  it('renders correctly', () => {
    testSnapshotShallow(
      <StepDetailScreen
        text="Roge is well behaved"
        CenterHeader={{ prop: 'center header' }}
        RightHeader={{ prop: 'right header' }}
        Body={{ prop: 'body' }}
        bottomButtonProps={null}
      />,
    );
  });
});
