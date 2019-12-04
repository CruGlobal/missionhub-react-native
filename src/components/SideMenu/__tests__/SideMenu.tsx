import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import SideMenu from '..';

const action = jest.fn();
const mockMenuItems = [
  { label: 'About', action, selected: false },
  { label: 'Help', action },
  { label: 'Share a Story With Us', action },
  { label: 'Write a Review', action },
  { label: 'Privacy Policy', action },
  { label: 'Terms of Service', action },
  { label: 'Sign In', action },
  { label: 'Sign Up', action },
];

jest.mock('../../IconButton', () => 'IconButton');

it('renders correctly', () => {
  const { snapshot } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} testID="Menu" />,
    {
      initialState: { drawer: { isOpen: false } },
    },
  );
  snapshot();
});

it('finds the close button', () => {
  const { getByTestId } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} testID="Menu" />,
    {
      initialState: { drawer: { isOpen: false } },
    },
  );
  expect(getByTestId('CloseButton')).toBeTruthy();
});
