import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import AssignToMeButton from '../../src/components/AssignToMeButton';

it('renders correctly', () => {
  testSnapshotShallow(<AssignToMeButton onPress={jest.fn()} />);
});
