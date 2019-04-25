import React from 'react';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

import AbsoluteSkip from '..';

it('render skip', () => {
  testSnapshotShallow(<AbsoluteSkip onSkip={jest.fn()} />);
});

it('renders skip with style', () => {
  testSnapshotShallow(
    <AbsoluteSkip onSkip={jest.fn()} style={{ padding: 5 }} />,
  );
});
it('renders skip with text style', () => {
  testSnapshotShallow(
    <AbsoluteSkip onSkip={jest.fn()} textStyle={{ padding: 5 }} />,
  );
});

it('calls onSkip when pressed', () => {
  const onSkip = jest.fn();
  const component = renderShallow(<AbsoluteSkip onSkip={onSkip} />);

  component
    .childAt(0)
    .props()
    .onPress();

  expect(onSkip).toHaveBeenCalled();
});
