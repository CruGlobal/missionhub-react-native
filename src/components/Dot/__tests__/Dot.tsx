import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import Dot from '..';

it('render dot', () => {
  renderWithContext(<Dot />, { noWrappers: true }).snapshot();
});

it('render dot with style', () => {
  renderWithContext(<Dot style={{ color: 'blue' }} />, {
    noWrappers: true,
  }).snapshot();
});
