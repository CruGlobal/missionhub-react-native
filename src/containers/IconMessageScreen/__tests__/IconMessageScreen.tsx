import 'react-native';
import React from 'react';

import IconMessageScreen from '..';

import { renderWithContext } from '../../../../testUtils';

const defaultProps = {
  mainText: 'Hello, world!',
  buttonText: 'Click me',
  iconPath: require('../../../../assets/images/add_someone.png'),
  onComplete: jest.fn(),
};

it('renders correctly', () => {
  renderWithContext(<IconMessageScreen {...defaultProps} />).snapshot();
});

it('renders skip button correctly', () => {
  renderWithContext(
    <IconMessageScreen {...defaultProps} onSkip={jest.fn()} />,
  ).snapshot();
});

it('renders back button correctly', () => {
  renderWithContext(
    <IconMessageScreen {...defaultProps} onBack={jest.fn()} />,
  ).snapshot();
});
