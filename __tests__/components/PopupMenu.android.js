import React from 'react';
import { UIManager } from 'react-native';
import { shallow } from 'enzyme';

import PopupMenu from '../../src/components/PopupMenu/index.android.js';
import { testSnapshotShallow } from '../../testUtils';

const onPress = jest.fn();
const props = {
  actions: [{ text: 'test', onPress }],
};

describe('PopupMenu Android', () => {
  it('renders with 1 button', () => {
    testSnapshotShallow(<PopupMenu {...props} />);
  });
  it('renders with icon props', () => {
    testSnapshotShallow(<PopupMenu {...props} iconProps={{ size: 24 }} />);
  });

  it('calls on press item for the right button', () => {
    UIManager.showPopupMenu = jest.fn();
    const instance = shallow(<PopupMenu {...props} />).instance();
    instance.handleItemPress(undefined, 0);
    expect(onPress).toHaveBeenCalled();
  });

  it('calls handle press', () => {
    UIManager.showPopupMenu = jest.fn();
    const instance = shallow(<PopupMenu {...props} />).instance();
    instance.handlePress();
    expect(onPress).toHaveBeenCalled();
  });
});
