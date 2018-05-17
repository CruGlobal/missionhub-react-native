import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import theme from '../src/theme';
import { createMockStore, testSnapshot } from '../testUtils';
import { MainTabBar, MainTabBarGroups, navItem } from '../src/AppRoutes';

const store = createMockStore({
  steps: {
    mine: null,
    reminders: [],
    userStepCount: {},
    pagination: {
      hasNextPage: true,
      page: 1,
    },
  },
  people: {
    allByOrg: {
      personal: { id: 'personal', people: {} },
    },
  },
  notifications: {
    token: '',
    hasAsked: false,
    shouldAsk: true,
    showReminder: true,
    pushDeviceId: '',
  },
  swipe: {
    stepsHome: true,
    stepsContact: true,
    stepsReminder: false, // Never show on the reminders anymore
    journey: true,
  },
});


it('renders home screen with tab bar with impact tab correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabBar />
    </Provider>);
});

it('renders home screen with tab bar with groups tab correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabBarGroups />
    </Provider>);
});

it('renders navItem correctly', () => {
  const stepsItem = navItem('steps')(theme.primaryColor);

  expect(stepsItem).toMatchSnapshot();
});
