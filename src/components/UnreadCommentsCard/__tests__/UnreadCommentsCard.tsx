import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import UnreadCommentCard from '..';

const props = { count: 12, onPress: jest.fn(), onClose: jest.fn() };
it('renders correctly', () => {
  renderWithContext(<UnreadCommentCard {...props} />, { noWrappers: true });
});
it('renders correctly singular', () => {
  renderWithContext(<UnreadCommentCard {...props} count={1} />, {
    noWrappers: true,
  });
});

describe('press events', () => {
  it('calls onPress', () => {
    const { getByTestId } = renderWithContext(
      <UnreadCommentCard {...props} />,
      { noWrappers: true },
    );
    fireEvent.press(getByTestId('CardButton'));
    expect(props.onPress).toHaveBeenCalled();
  });
  it('calls onClose', () => {
    const { getByTestId } = renderWithContext(
      <UnreadCommentCard {...props} />,
      { noWrappers: true },
    );
    fireEvent.press(getByTestId('CloseButton'));
    expect(props.onClose).toHaveBeenCalled();
  });
});
