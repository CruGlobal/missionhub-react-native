import React from 'react';
import { View } from 'react-native';

import PopupMenu from '../index.android';
import { renderWithContext } from '../../../../testUtils';

const action1 = { text: 'test', onPress: jest.fn() };
const action2 = { text: 'testing', onPress: jest.fn() };
const actions = [action1, action2];
const buttonProps = { style: { margin: 10 } };
const iconProps = { size: 24, style: { paddingVertical: 10 } };

describe('PopupMenu Android', () => {
  it('renders correctly', () => {
    // @ts-ignore
    renderWithContext(<PopupMenu actions={actions} />).snapshot();
  });

  it('renders with children', () => {
    renderWithContext(
      // @ts-ignore
      <PopupMenu actions={actions}>
        <View />
      </PopupMenu>,
    ).snapshot();
  });

  it('renders with button and icon props', () => {
    renderWithContext(
      <PopupMenu
        // @ts-ignore
        actions={actions}
        buttonProps={buttonProps}
        iconProps={iconProps}
      />,
    ).snapshot();
  });

  it('renders disabled', () => {
    renderWithContext(
      // @ts-ignore
      <PopupMenu actions={actions} disabled={true} />,
    ).snapshot();
  });

  it('renders for long press trigger', () => {
    renderWithContext(
      // @ts-ignore
      <PopupMenu actions={actions} triggerOnLongPress={true} />,
    ).snapshot();
  });

  /*describe('press menu button', () => {
    it('handles press', () => {
      const { getByTestId } = renderWithContext(
        <PopupMenu actions={actions} triggerOnLongPress={true} />,
      );

      fireEvent(getByTestId('popupMenuButton'), 'onPress');
    });
  });*/
});
