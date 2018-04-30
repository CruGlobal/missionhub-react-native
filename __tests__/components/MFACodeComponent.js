import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import MFACodeComponent from '../../src/components/MFACodeComponent';

it('renders loading', () => {
  testSnapshotShallow(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={true}
      t={jest.fn((key) => key)}
    />
  );
});

it('renders not loading', () => {
  testSnapshotShallow(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={false}
      t={jest.fn((key) => key)}
    />
  );
});

it('calls onChangeText prop', () => {
  const onChangeText = jest.fn();

  renderShallow(
    <MFACodeComponent
      onChangeText={onChangeText}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={true}
      t={jest.fn((key) => key)}
    />
  ).childAt(1).childAt(2).childAt(1).props().onChangeText();

  expect(onChangeText).toHaveBeenCalled();
});

it('submits when DONE button is pressed', () => {
  const onSubmit = jest.fn();

  renderShallow(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={onSubmit}
      isLoading={true}
      t={jest.fn((key) => key)}
    />
  ).childAt(0).childAt(1).props().onPress();

  expect(onSubmit).toHaveBeenCalled();
});

it('submits when done on keyboard is pressed', () => {
  const onSubmit = jest.fn();

  renderShallow(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={onSubmit}
      isLoading={true}
      t={jest.fn((key) => key)}
    />
  ).childAt(1).childAt(2).childAt(1).props().onSubmitEditing();

  expect(onSubmit).toHaveBeenCalled();
});
