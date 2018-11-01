import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils';

import NullStateComponent from '..';

it('render assigned contact', () => {
  testSnapshotShallow(
    <NullStateComponent
      imageSource={1443235}
      headerText="some header"
      descriptionText="some description"
    />,
  );
});
