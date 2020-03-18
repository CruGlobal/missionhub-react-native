import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import ReportItemHeaderCard from '..';

const props = { count: 12, onPress: jest.fn() };
it('renders correctly', () => {
  renderWithContext(<ReportItemHeaderCard {...props} />, {
    noWrappers: true,
  }).snapshot();
});

describe('press event', () => {
  it('calls onPress', () => {
    const { getByTestId } = renderWithContext(
      <ReportItemHeaderCard {...props} />,
      { noWrappers: true },
    );
    fireEvent.press(getByTestId('ReportItemHeaderCardButton'));

    expect(props.onPress).toHaveBeenCalled();
  });
});
