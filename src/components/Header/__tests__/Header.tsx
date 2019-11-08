import React from 'react';

import { Text } from '../../common';
import { renderWithContext } from '../../../../testUtils';

import Header from '..';

it('renders with no props', () => {
  renderWithContext(<Header />).snapshot();
});

it('renders with left content', () => {
  renderWithContext(<Header left={<Text>Left</Text>} />).snapshot();
});

it('renders with center content', () => {
  renderWithContext(<Header center={<Text>Center</Text>} />).snapshot();
});

it('renders with right content', () => {
  renderWithContext(<Header right={<Text>Right</Text>} />).snapshot();
});

it('renders with title', () => {
  renderWithContext(<Header title="Title" />).snapshot();
});

it('renders with title and subtitle', () => {
  renderWithContext(<Header title="Title" title2="Subtitle" />).snapshot();
});

it('renders with shadow', () => {
  renderWithContext(<Header shadow={true} />).snapshot();
});

it('renders with styles', () => {
  renderWithContext(
    <Header
      title="Title"
      style={{ backgroundColor: 'blue' }}
      titleStyle={{ color: 'red' }}
    />,
  ).snapshot();
});
