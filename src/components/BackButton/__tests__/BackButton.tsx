import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import theme from '../../../theme';

import BackButton from '..';

jest.mock('../../../actions/navigation');

const navigateBackResults = { type: 'navigate back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
});

describe('back button', () => {
  it('renders normally', () => {
    renderWithContext(<BackButton />).snapshot();
  });

  it('renders with different color', () => {
    renderWithContext(<BackButton iconColor={theme.parakeetBlue} />).snapshot();
  });

  it('calls navigate back once', () => {
    const { store, getByTestId } = renderWithContext(<BackButton />);

    fireEvent.press(getByTestId('BackButton'));

    expect(store.getActions()).toEqual([navigateBackResults]);
  });
});

describe('back button customNavigate', () => {
  it('custom navigation function is called', () => {
    const mockCustomNav = jest.fn();

    const { getByTestId } = renderWithContext(
      <BackButton customNavigate={mockCustomNav} />,
    );

    fireEvent.press(getByTestId('BackButton'));

    expect(mockCustomNav).toHaveBeenCalledTimes(1);
  });
});
