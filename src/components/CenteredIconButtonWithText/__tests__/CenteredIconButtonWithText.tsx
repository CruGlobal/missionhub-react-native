import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import CenteredIconButtonWithText from '..';

it('renders correctly with non-null onClick', () => {
  renderWithContext(
    <CenteredIconButtonWithText
      onClick={jest.fn()}
      icon="some icon"
      text="Hello, MissionHub"
      wrapperStyle={{ padding: 10 }}
      buttonStyle={{ padding: 10 }}
    />,
  ).snapshot();
});

it('renders correctly with undefined onClick', () => {
  renderWithContext(
    <CenteredIconButtonWithText
      onClick={undefined}
      icon="some icon"
      text="Hello, MissionHub"
    />,
  ).snapshot();
});
