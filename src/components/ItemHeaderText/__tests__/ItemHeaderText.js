import 'react-native';
import React from 'react';

import ItemHeaderText from '..';

import { renderShallow } from '../../../../testUtils';

const text = 'Roge Goers';

it('renders correctly', () => {
  expect(renderShallow(<ItemHeaderText text={text} />)).toMatchSnapshot();
});
