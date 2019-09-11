import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import Separator from '..';

it('renders correctly', () => {
  renderWithContext(<Separator />, { noWrappers: true }).snapshot();
});

it('renders correctly with style', () => {
  renderWithContext(<Separator style={{ padding: 10 }} />, {
    noWrappers: true,
  }).snapshot();
});
