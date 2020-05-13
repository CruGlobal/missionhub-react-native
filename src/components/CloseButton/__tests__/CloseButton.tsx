import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';

import theme from '../../../theme';
import CloseButton, { CloseButtonTypeEnum } from '..';

jest.mock('../../../actions/navigation');

const navigateBackResults = { type: 'navigate back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
});

describe('back button', () => {
  it('renders normally', () => {
    renderWithContext(<CloseButton />).snapshot();
  });

  it('renders correctly | circle', () => {
    renderWithContext(
      <CloseButton type={CloseButtonTypeEnum.circle} />,
    ).snapshot();
  });

  it('renders with different color', () => {
    renderWithContext(
      <CloseButton iconColor={theme.parakeetBlue} />,
    ).snapshot();
  });

  it('calls navigate back once', () => {
    const { store, getByTestId } = renderWithContext(<CloseButton />);

    fireEvent.press(getByTestId('CloseButton'));

    expect(store.getActions()).toEqual([navigateBackResults]);
  });
});

describe('back button customNavigate', () => {
  it('custom navigation function is called', () => {
    const mockCustomNav = jest.fn();

    const { getByTestId } = renderWithContext(
      <CloseButton customNavigate={mockCustomNav} />,
    );

    fireEvent.press(getByTestId('CloseButton'));

    expect(mockCustomNav).toHaveBeenCalledTimes(1);
  });
});
