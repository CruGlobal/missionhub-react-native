import React from 'react';

import Card from '../../src/components/Card';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

describe('Card', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<Card />);
  });

  it('calls props.onPress when pressed', () => {
    const onPress = jest.fn();
    const component = renderShallow(<Card onPress={onPress} />);

    component.simulate('press');

    expect(onPress).toHaveBeenCalled();
  });
});
