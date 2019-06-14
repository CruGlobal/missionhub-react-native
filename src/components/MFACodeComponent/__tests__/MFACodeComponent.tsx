import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import { MFACodeComponent } from '..';

jest.mock('../../../components/common', () => ({
  Flex: 'Flex',
  Text: 'Text',
  Input: 'Input',
  Button: 'Button',
}));
jest.mock('../../../components/LoadingWheel', () => 'LoadingWheel');
jest.mock('../../../containers/BackButton', () => 'BackButton');

it('should render correctly', () => {
  renderWithContext(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={false}
    />,
  ).snapshot();
});
it('should change loading state', () => {
  const { recordSnapshot, rerender, diffSnapshot } = renderWithContext(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={false}
    />,
  );

  recordSnapshot();
  rerender(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={true}
    />,
  );
  diffSnapshot();

  recordSnapshot();
  rerender(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={false}
    />,
  );
  diffSnapshot();
});

it('calls onChangeText prop', () => {
  const onChangeText = jest.fn();

  const { getByTestId } = renderWithContext(
    <MFACodeComponent
      onChangeText={onChangeText}
      value="Roge"
      onSubmit={jest.fn()}
      isLoading={true}
    />,
  );
  fireEvent.changeText(getByTestId('mfaCodeInput'), '123456');

  expect(onChangeText).toHaveBeenCalledWith('123456');
});

it('submits when DONE button is pressed', () => {
  const onSubmit = jest.fn();

  const { getByTestId } = renderWithContext(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={onSubmit}
      isLoading={true}
    />,
  );
  fireEvent.press(getByTestId('doneButton'));

  expect(onSubmit).toHaveBeenCalled();
});

it('submits when done on keyboard is pressed', () => {
  const onSubmit = jest.fn();

  const { getByTestId } = renderWithContext(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={onSubmit}
      isLoading={true}
    />,
  );
  fireEvent(getByTestId('mfaCodeInput'), 'submitEditing');

  expect(onSubmit).toHaveBeenCalled();
});
