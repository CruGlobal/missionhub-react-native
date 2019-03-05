import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import CommentItem from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const item = {
  content: 'hello roge',
  created_at: '2018-06-11 12:00:00 UTC',
  person: { first_name: 'Roge', last_name: 'Goers' },
};

const organization = { id: '7342342' };

let onLongPress;

describe('with onLongPress', () => {
  beforeAll(() => {
    onLongPress = jest.fn();
  });

  it('renders correctly with onLongPress', () => {
    testSnapshotShallow(
      <CommentItem
        item={item}
        onLongPress={onLongPress}
        organization={organization}
      />,
    );
  });

  it('calls onLongPress', () => {
    const component = shallow(
      <CommentItem
        item={item}
        onLongPress={onLongPress}
        organization={organization}
      />,
    );

    component.props().onLongPress();

    expect(onLongPress).toHaveBeenCalledWith(item, undefined);
  });
});

describe('without onLongPress', () => {
  beforeAll(() => {
    onLongPress = null;
  });

  it('renders correctly', () => {
    testSnapshotShallow(
      <CommentItem
        item={item}
        organization={organization}
        onLongPress={onLongPress}
      />,
    );
  });

  it('calls ref', () => {
    const instance = shallow(
      <CommentItem
        item={item}
        organization={organization}
        onLongPress={onLongPress}
      />,
    ).instance();
    instance.view = null;
    instance.ref('test');
    expect(instance.view).toEqual('test');
  });
});
