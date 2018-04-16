import 'react-native';
import React from 'react';
import theme from '../src/theme';

import { renderShallow } from '../testUtils';
import { MainTabRoutes, navItem } from '../src/AppRoutes';


it('renders tab bar correctly', () => {
  const tabNav = renderShallow(<MainTabRoutes />).dive().dive().dive().dive();
  const tabBar = tabNav.find('withOrientation').dive();

  expect(tabBar).toMatchSnapshot();
});

it('renders navItem correctly', () => {
  const stepsItem = navItem('steps')(theme.primaryColor);

  expect(stepsItem).toMatchSnapshot();
});