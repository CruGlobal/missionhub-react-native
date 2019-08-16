import 'react-native';
import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import RefreshControl from '..';

const props = { refreshing: true, onRefresh: jest.fn() };
it('renders correctly', () => {
  renderWithContext(<RefreshControl {...props} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders correctly overriding default props', () => {
  renderWithContext(
    <RefreshControl
      {...props}
      progressBackgroundColor={'blue'}
      colors={['orange', 'green']}
      tintColor={'red'}
    />,
    { noWrappers: true },
  ).snapshot();
});
