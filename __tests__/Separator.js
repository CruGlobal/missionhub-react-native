import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Separator } from '../src/components/common';
import { testSnapshot } from '../testUtils';

it('renders correctly', () => {
  testSnapshot(<Separator />);
});
