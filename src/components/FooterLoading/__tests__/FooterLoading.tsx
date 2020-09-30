import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { FooterLoading } from '..';

it('renders correctly', () => {
  renderWithContext(<FooterLoading />, { noWrappers: true }).snapshot();
});
