import React from 'react';

import ReportCommentHeaderCard from '..';

import { testSnapshot, renderShallow } from '../../../../testUtils';

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
