import React from 'react';
import { ActionSheetIOS } from 'react-native';

import PopupMenu from '../../src/components/PopupMenu/index.ios.js';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

const onPress = jest.fn();
let props = {
  actions: [{ text: 'test', onPress }],
};

describe('PopupMenu iOS', () => {
  it('renders with 1 button', () => {
    testSnapshotShallow(<PopupMenu {...props} />);
  });
  it('renders with icon props', () => {
    testSnapshotShallow(<PopupMenu {...props} iconProps={{ size: 24 }} />);
  });

  it('calls the action sheet for ios', () => {
    ActionSheetIOS.showActionSheetWithOptions = jest.fn();
    const instance = renderShallow(<PopupMenu {...props} />).instance();
    instance.open();
    expect(ActionSheetIOS.showActionSheetWithOptions).toHaveBeenCalled();
  });
});
