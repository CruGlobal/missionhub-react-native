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

const organization = { id: 'w342342' };

it('renders correctly', () => {
  testSnapshotShallow(<CommentItem item={item} organization={organization} />);
});

it('renders correctly with onLongPress', () => {
  testSnapshotShallow(
    <CommentItem
      item={item}
      onLongPress={jest.fn()}
      organization={organization}
    />,
  );
});

it('renders correctly with onLongPress', () => {
  const onLongPress = jest.fn();
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

it('calls ref', () => {
  const instance = shallow(
    <CommentItem item={item} organization={organization} />,
  ).instance();
  instance.view = null;
  instance.ref('test');
  expect(instance.view).toEqual('test');
});
