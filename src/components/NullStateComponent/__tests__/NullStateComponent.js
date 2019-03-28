import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils';
import { Text } from '../../common';

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

it('render with content', () => {
  testSnapshotShallow(
    <NullStateComponent
      imageSource={1443235}
      headerText="some header"
      descriptionText="some description"
      content={<Text>Content</Text>}
    />,
  );
});
