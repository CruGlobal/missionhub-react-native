import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import LoadingWheel from '..';

it('renders correctly', () => {
  renderWithContext(<LoadingWheel />, { noWrappers: true }).snapshot();
});
