import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import FooterLoading from '../src/components/FooterLoading';
import { testSnapshot } from '../testUtils';

it('renders correctly', () => {
  testSnapshot(<FooterLoading />);
});
