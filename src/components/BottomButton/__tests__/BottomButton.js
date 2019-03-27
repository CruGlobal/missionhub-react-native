import React from 'react';

import { renderShallow } from '../../../../testUtils/index';

import BottomButton from '..';

let component;
const onPress = jest.fn();
const text = 'Button Text';

beforeEach(() => {
  component = renderShallow(<BottomButton text={text} onPress={onPress} />);
});

it('renders correctly', () => {
  expect(component).toMatchSnapshot();
});
