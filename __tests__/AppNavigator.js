import React from 'react';
import { View } from 'react-native';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';

import AppNavigator from '../src/AppNavigator';
import { renderShallow, createMockStore } from '../testUtils';

jest.mock('react-navigation-redux-helpers');

reduxifyNavigator.mockReturnValue(<View />);

const store = createMockStore({
  nav: {
    index: 1,
  },
});

describe('AppNavigator', () => {
  it('renders correctly', () => {
    expect(renderShallow(<AppNavigator />, store)).toMatchSnapshot();
  });
});
