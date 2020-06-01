import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import NotificationCenterScreen from '..';

it('renders correctly', () => {
  renderWithContext(<NotificationCenterScreen />).snapshot();
});
