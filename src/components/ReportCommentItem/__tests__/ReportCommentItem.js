import React from 'react';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

import ReportCommentItem from '..';

const comment = {
  id: 'commentId',
  content: 'something',
  person: {
    first_name: 'commentFirst',
    last_name: 'commentLast',
    full_name: 'commentFirst commentLast',
  },
};
const person = {
  id: 'personId',
  full_name: 'person full name',
};
const item = { comment, person };
const props = {
  item,
  onIgnore: jest.fn(),
  onDelete: jest.fn(),
};

it('renders correctly', () => {
  testSnapshotShallow(<ReportCommentItem {...props} />);
});

describe('ignore and delete', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(<ReportCommentItem {...props} />);
  });

  it('calls ignore', () => {
    component
      .childAt(2)
      .childAt(0)
      .childAt(0)
      .props()
      .onPress();
    expect(props.onIgnore).toHaveBeenCalledWith(item);
  });
  it('calls delete', () => {
    component
      .childAt(2)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();
    expect(props.onDelete).toHaveBeenCalledWith(item);
  });
});
