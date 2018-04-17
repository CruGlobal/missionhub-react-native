import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import theme from '../src/theme';

import { createMockStore, renderShallow, testSnapshot } from '../testUtils';
import { MainTabRoutes, navItem } from '../src/AppRoutes';

const store = createMockStore({
  steps: {
    mine: [],
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


it('renders home screen with tab bar correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabRoutes />
    </Provider>);
});

it('renders navItem correctly', () => {
  const stepsItem = navItem('steps')(theme.primaryColor);

  expect(stepsItem).toMatchSnapshot();
});