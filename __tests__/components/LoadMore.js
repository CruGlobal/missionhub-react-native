import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import LoadMore from '../../src/components/LoadMore';

it('render load more button', () => {
  testSnapshotShallow(<LoadMore onPress={jest.fn()} />);
});

it('calls onPress prop', () => {
  const onPress = jest.fn();

  renderShallow(<LoadMore onPress={onPress} />)
    .props()
    .onPress();

  expect(onPress).toHaveBeenCalled();
});
