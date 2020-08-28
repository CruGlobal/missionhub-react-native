import React from 'react';
import { View, Text } from 'react-native';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import Card from '..';

const children = (
  <View>
    <Text>Testing</Text>
  </View>
);

it('render card', () => {
  testSnapshotShallow(<Card />);
});

it('render card with children', () => {
  testSnapshotShallow(<Card>{children}</Card>);
});

it('render touchable card', () => {
  testSnapshotShallow(<Card onPress={jest.fn()} />);
});

it('render touchable card with children', () => {
  testSnapshotShallow(<Card onPress={jest.fn()}>{children}</Card>);
});

it('calls props.onPress when pressed', () => {
  const onPress = jest.fn();
  const component = renderShallow(<Card onPress={onPress} />);

  component.simulate('press');

  expect(onPress).toHaveBeenCalled();
});

it('calls props.onPress when pressed', () => {
  const onPress = jest.fn();
  const component = renderShallow(<Card onPress={onPress} />);

  component.simulate('press');

  expect(onPress).toHaveBeenCalled();
});
