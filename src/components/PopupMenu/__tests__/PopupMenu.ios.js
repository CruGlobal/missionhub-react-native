import React from 'react';
import { shallow } from 'enzyme';

import PopupMenu from '../index.ios.js';
import { testSnapshot } from '../../../../testUtils';
import * as common from '../../../utils/common';

const onPress = jest.fn();
common.showMenu = jest.fn();
const props = {
  actions: [{ text: 'test', onPress }],
};

describe('PopupMenu iOS', () => {
  it('renders with 1 button', () => {
    testSnapshot(<PopupMenu {...props} />);
  });
  it('renders with icon props', () => {
    testSnapshot(<PopupMenu {...props} iconProps={{ size: 24 }} />);
  });

  it('calls the action sheet for ios', () => {
    const instance = shallow(<PopupMenu {...props} />).instance();
    instance.open();
    expect(common.showMenu).toHaveBeenCalledWith(props.actions);
  });
});
