import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { MFACodeComponent } from '..';
import { AuthError } from '../../../auth/constants';

jest.mock('../../../components/common', () => ({
  Flex: 'Flex',
  Text: 'Text',
  Input: 'Input',
  Button: 'Button',
}));
jest.mock('../../../components/LoadingWheel', () => 'LoadingWheel');
jest.mock(
  '../../../containers/DeprecatedBackButton',
  () => 'DeprecatedBackButton',
);

it('should render correctly', () => {
  renderWithContext(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      loading={false}
      error={AuthError.None}
    />,
  ).snapshot();
});
it('should change loading state', () => {
  const { recordSnapshot, rerender, diffSnapshot } = renderWithContext(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      loading={false}
      error={AuthError.None}
    />,
  );

  recordSnapshot();
  rerender(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      loading={true}
      error={AuthError.None}
    />,
  );
  diffSnapshot();

  recordSnapshot();
  rerender(
    <MFACodeComponent
      onChangeText={jest.fn()}
      value="Roge"
      onSubmit={jest.fn()}
      loading={false}
      error={AuthError.None}
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
      loading={true}
      error={AuthError.None}
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
      loading={true}
      error={AuthError.None}
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
      loading={true}
      error={AuthError.None}
    />,
  );
  fireEvent(getByTestId('mfaCodeInput'), 'submitEditing');

  expect(onSubmit).toHaveBeenCalled();
});
