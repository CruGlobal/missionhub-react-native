import React from 'react';

import {
  testSnapshotShallow,
  renderTestingInstance,
} from '../../../../testUtils/index';
import Button from '../../Button';

import BottomButton from '..';

const onPress = jest.fn();
const text = 'Button Text';

it('renders correctly', () => {
  testSnapshotShallow(<BottomButton text={text} onPress={onPress} />);
});

it('presses button', () => {
  const root = renderTestingInstance(
    <BottomButton text={text} onPress={onPress} />,
  );
  root.findByType(Button).props.onPress();
  expect(onPress).toHaveBeenCalled();
});
