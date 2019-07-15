import React from 'react';

import { testSnapshot, renderShallow } from '../../../../testUtils';

import ReportCommentHeaderCard from '..';

const props = { count: 12, onPress: jest.fn() };
it('renders correctly', () => {
  testSnapshot(<ReportCommentHeaderCard {...props} />);
});

describe('press events', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(<ReportCommentHeaderCard {...props} />);
  });

  it('calls onPress', () => {
    component.props().onPress();
    expect(props.onPress).toHaveBeenCalled();
  });
});
