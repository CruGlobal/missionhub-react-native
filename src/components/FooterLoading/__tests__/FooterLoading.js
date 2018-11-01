import 'react-native';
import React from 'react';

import FooterLoading from '..';

import { testSnapshot } from '../../../../testUtils';

it('renders correctly', () => {
  testSnapshot(<FooterLoading />);
});
