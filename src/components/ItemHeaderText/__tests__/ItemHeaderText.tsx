import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import ItemHeaderText from '..';

const text = 'Roge Goers';

it('renders correctly', () => {
  renderWithContext(<ItemHeaderText text={text} style={{ fontSize: 12 }} />, {
    noWrappers: true,
  }).snapshot();
});
