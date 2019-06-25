import 'react-native';
import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import Icon from '..';

it('renders correctly', () => {
  renderWithContext(
    <Icon name="addContactIcon" type="MissionHub" size={24} />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('renders correctly with arrow-back', () => {
  renderWithContext(
    <Icon name="arrow-back" size={12} style={{ padding: 10 }} />,
    {
      noWrappers: true,
    },
  ).snapshot();
});
