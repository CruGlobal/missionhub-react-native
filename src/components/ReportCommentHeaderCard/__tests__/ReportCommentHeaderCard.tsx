import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import ReportCommentHeaderCard from '..';

const props = { count: 12, onPress: jest.fn() };
it('renders correctly', () => {
  renderWithContext(<ReportCommentHeaderCard {...props} />, {
    noWrappers: true,
  }).snapshot();
});

describe('press event', () => {
  it('calls onPress', () => {
    const { getByTestId } = renderWithContext(
      <ReportCommentHeaderCard {...props} />,
      { noWrappers: true },
    );
    fireEvent.press(getByTestId('ReportCommentHeaderCardButton'));

    expect(props.onPress).toHaveBeenCalled();
  });
});
