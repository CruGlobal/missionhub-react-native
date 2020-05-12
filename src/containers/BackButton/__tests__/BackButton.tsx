import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import BackButton from '..';

jest.mock('../../../components/IconButton', () => 'IconButton');

describe('back button', () => {
  it('renders normally', () => {
    renderWithContext(<BackButton />).snapshot();
  });

  it('renders with image', () => {
    renderWithContext(<BackButton image={12345} />).snapshot();
  });

  it('renders with RenderIcon', () => {
    renderWithContext(<BackButton RenderIcon={'testIcon'} />).snapshot();
  });

  it('calls navigate back once', () => {
    const { store, getByTestId } = renderWithContext(<BackButton />);

    fireEvent.press(getByTestId('BackButton'));

    expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "immediate": undefined,
          "key": undefined,
          "type": "Navigation/BACK",
        },
      ]
    `);
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
