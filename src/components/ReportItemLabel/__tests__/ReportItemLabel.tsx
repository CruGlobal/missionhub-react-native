import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import ReportItemLabel from '..';

it('render label', () => {
  renderWithContext(
    <ReportItemLabel
      label="Label"
      user="Test User"
      communityName={'Test Community'}
    />,
    {
      noWrappers: true,
    },
  ).snapshot();
});
