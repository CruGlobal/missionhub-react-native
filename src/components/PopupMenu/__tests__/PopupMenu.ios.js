import React from 'react';
import { View, ActionSheetIOS } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import PopupMenu from '../index.ios.js';
import { renderWithContext } from '../../../../testUtils';

const action1 = { text: 'test', onPress: jest.fn() };
const action2 = { text: 'testing', onPress: jest.fn(), destructive: true };
const actions = [action1, action2];
const buttonProps = { style: { margin: 10 } };
const iconProps = { size: 24, style: { paddingVertical: 10 } };

describe('PopupMenu iOS', () => {
  it('renders correctly', () => {
    renderWithContext(<PopupMenu actions={actions} />).snapshot();
  });

  it('renders with children', () => {
    renderWithContext(
      <PopupMenu actions={actions}>
        <View />
      </PopupMenu>,
    ).snapshot();
  });

  it('renders with button and icon props', () => {
    renderWithContext(
      <PopupMenu
        actions={actions}
        buttonProps={buttonProps}
        iconProps={iconProps}
      />,
    ).snapshot();
  });

  it('renders disabled', () => {
    renderWithContext(
      <PopupMenu actions={actions} disabled={true} />,
    ).snapshot();
  });

  it('renders for long press trigger', () => {
    renderWithContext(
      <PopupMenu actions={actions} triggerOnLongPress={true} />,
    ).snapshot();
  });

  describe('press menu button', () => {
    beforeEach(() => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn((a, b) => b(0));
    });

    it('should call action sheet', () => {
      const { getByTestId } = renderWithContext(
        <PopupMenu actions={actions} />,
      );

      fireEvent(getByTestId('popupMenuButton'), 'onPress');

      expect(ActionSheetIOS.showActionSheetWithOptions).toHaveBeenCalledWith(
        {
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          options: [action1.text, action2.text, 'Cancel'],
        },
        expect.any(Function),
      );
      expect(actions[0].onPress).toHaveBeenCalled();
    });

    it('should call action sheet with title', () => {
      const title = 'title';

      const { getByTestId } = renderWithContext(
        <PopupMenu actions={actions} title={title} />,
      );

      fireEvent(getByTestId('popupMenuButton'), 'onPress');

      expect(ActionSheetIOS.showActionSheetWithOptions).toHaveBeenCalledWith(
        {
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          options: [action1.text, action2.text, 'Cancel'],
          title,
        },
        expect.any(Function),
      );
      expect(actions[0].onPress).toHaveBeenCalled();
    });

    it('should call action sheet on long press', () => {
      const { getByTestId } = renderWithContext(
        <PopupMenu actions={actions} triggerOnLongPress={true} />,
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');

      expect(ActionSheetIOS.showActionSheetWithOptions).toHaveBeenCalledWith(
        {
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          options: [action1.text, action2.text, 'Cancel'],
        },
        expect.any(Function),
      );
      expect(actions[0].onPress).toHaveBeenCalled();
    });
  });
});
