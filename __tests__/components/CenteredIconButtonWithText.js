import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import CenteredIconButtonWithText from '../../src/components/CenteredIconButtonWithText';

it('renders correctly with non-null onClick', () => {
  testSnapshotShallow(
    <CenteredIconButtonWithText
      onClick={jest.fn()}
      icon="some icon"
      text="Hello, MissionHub"
      wrapperStyle={{ name: 'extra wrapper style' }}
      buttonStyle={{ name: 'extra button style' }}
    />,
  );
});

it('renders correctly with undefined onClick', () => {
  testSnapshotShallow(
    <CenteredIconButtonWithText
      onClick={undefined}
      icon="some icon"
      text="Hello, MissionHub"
    />,
  );
});
