import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import ReportCommentLabel from '..';

it('render label', () => {
  renderWithContext(<ReportCommentLabel label="Label" user="Test User" />, {
    noWrappers: true,
  }).snapshot();
});
