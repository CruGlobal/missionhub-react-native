import 'react-native';
import React from 'react';

import { testSnapshot } from '../../../../testUtils';

import FooterLoading from '..';

it('renders correctly', () => {
  testSnapshot(<FooterLoading />);
});
