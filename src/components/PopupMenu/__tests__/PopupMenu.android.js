import React from 'react';
import { UIManager } from 'react-native';
import { shallow } from 'enzyme';

import PopupMenu from '../index.android.js';
import { testSnapshot } from '../../../../testUtils';
import * as common from '../../../utils/common';

const onPress = jest.fn();
common.showMenu = jest.fn();
const props = {
  actions: [{ text: 'test', onPress }],
};

describe('PopupMenu Android', () => {
  it('renders with 1 button', () => {
    testSnapshot(<PopupMenu {...props} />);
  });
  it('renders with icon props', () => {
    testSnapshot(<PopupMenu {...props} iconProps={{ size: 24 }} />);
  });

  it('calls handle press', () => {
    UIManager.showPopupMenu = jest.fn();
    const instance = shallow(<PopupMenu {...props} />).instance();
    instance.handlePress();
    expect(common.showMenu).toHaveBeenCalledWith(props.actions, undefined);
  });
});
