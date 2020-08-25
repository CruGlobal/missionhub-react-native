import React from 'react';
import { Text } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import NullStateComponent from '..';

it('render assigned contact', () => {
  renderWithContext(
    <NullStateComponent
      imageSource={1443235}
      headerText="some header"
      descriptionText="some description"
    />,
    { noWrappers: true },
  ).snapshot();
});

it('render with content', () => {
  renderWithContext(
    <NullStateComponent
      imageSource={1443235}
      headerText="some header"
      descriptionText="some description"
      content={<Text>Content</Text>}
    />,
    { noWrappers: true },
  ).snapshot();
});
