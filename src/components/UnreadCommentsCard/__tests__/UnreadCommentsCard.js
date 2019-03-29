import React from 'react';

import UnreadCommentCard from '..';

import { testSnapshot, renderShallow } from '../../../../testUtils';

const props = { count: 12, onPress: jest.fn(), onClose: jest.fn() };
it('renders correctly', () => {
  testSnapshot(<UnreadCommentCard {...props} />);
});

describe('press events', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(<UnreadCommentCard {...props} />);
  });

  it('calls onPress', () => {
    component.props().onPress();
    expect(props.onPress).toHaveBeenCalled();
  });
  it('calls onClose', () => {
    component
      .childAt(0)
      .childAt(2)
      .childAt(0)
      .props()
      .onPress();
    expect(props.onClose).toHaveBeenCalled();
  });
});
