import React from 'react';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

import AbsoluteSkip from '..';

it('render skip', () => {
  testSnapshotShallow(<AbsoluteSkip onSkip={jest.fn()} />);
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
