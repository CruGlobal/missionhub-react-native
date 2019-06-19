import React from 'react';

import {
  testSnapshotShallow,
  renderWithContext,
} from '../../../../testUtils/index';

import BottomButton from '..';

const onPress = jest.fn();
const text = 'Button Text';

it('renders correctly', () => {
  testSnapshotShallow(<BottomButton text={text} onPress={onPress} />);
});

it('presses button', () => {
  renderWithContext(<BottomButton text={text} onPress={onPress} />, {
    hasStore: false,
  })
    .getByTestId('Button')
    .props.onPress();
  expect(onPress).toHaveBeenCalled();
});
