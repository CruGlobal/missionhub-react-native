import React from 'react';
import { BackHandler } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

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

(BackHandler.addEventListener as jest.Mock) = jest.fn((_, callback) => {
  callback();
});
BackHandler.removeEventListener = jest.fn((_, callback) => {
  callback();
});

it('renders correctly', () => {
  const { snapshot } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false } },
    },
  );
  snapshot();
});

it('finds the close button', () => {
  const { getByTestId } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false } },
    },
  );
  expect(getByTestId('CloseButton')).toBeTruthy();
  expect(BackHandler.addEventListener).toHaveBeenCalled();
});

it('should fire onBackPress', async () => {
  const { getByTestId } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: true } },
    },
  );
  await fireEvent.press(getByTestId('CloseButton'));
});

it('unmounts', () => {
  const { unmount } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false } },
    },
  );
  unmount();
  expect(BackHandler.removeEventListener).toHaveBeenCalled();
});
