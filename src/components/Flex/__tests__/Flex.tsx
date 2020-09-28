import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import Flex from '..';

it('renders correctly', () => {
  renderWithContext(<Flex />, { noWrappers: true }).snapshot();
});

it('renders align center correctly', () => {
  renderWithContext(<Flex align="center" />, { noWrappers: true }).snapshot();
});

it('renders justify center correctly', () => {
  renderWithContext(<Flex justify="center" />, { noWrappers: true }).snapshot();
});

it('renders alignSelf center correctly', () => {
  renderWithContext(<Flex self="center" />, { noWrappers: true }).snapshot();
});

it('renders value correctly', () => {
  renderWithContext(<Flex value={1} />, { noWrappers: true }).snapshot();
});

it('renders direction correctly', () => {
  renderWithContext(<Flex direction="row" />, { noWrappers: true }).snapshot();
});

it('renders animation correctly', () => {
  renderWithContext(<Flex animation="bounce" />, {
    noWrappers: true,
  }).snapshot();
});

it('renders grow correctly', () => {
  renderWithContext(<Flex grow={2} />, { noWrappers: true }).snapshot();
});
