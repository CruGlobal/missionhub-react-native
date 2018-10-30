import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import theme from '../src/theme';
import {
  createMockStore,
  testSnapshot,
  createMockNavState,
} from '../testUtils';
import { navItem } from '../src/AppRoutes';
import { communitiesSelector } from '../src/selectors/organizations';
import MainTabs from '../src/containers/MainTabs';

jest.mock('../src/selectors/organizations');

const mockState = {
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
    showReminder: true,
    pushDeviceId: '',
  },
  swipe: {
    stepsHome: true,
    stepsContact: true,
    stepsReminder: false, // Never show on the reminders anymore
    journey: true,
  },
  organizations: {
    all: [],
  },
};
const store = createMockStore({
  ...mockState,
  auth: { person: { user: { groups_feature: false } } },
});
const groupsStore = createMockStore({
  ...mockState,
  auth: { person: { user: { groups_feature: true } } },
});

communitiesSelector.mockReturnValue([]);

it('renders home screen with tab bar with impact tab correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabs navigation={createMockNavState({})} />
    </Provider>,
  );
});

it('renders home screen with tab bar with groups tab correctly', () => {
  testSnapshot(
    <Provider store={groupsStore}>
      <MainTabs navigation={createMockNavState({})} />
    </Provider>,
  );
});

it('renders home screen with tab bar with groups tab selected correctly', () => {
  testSnapshot(
    <Provider store={groupsStore}>
      <MainTabs navigation={createMockNavState({ startTab: 'groups' })} />
    </Provider>,
  );
});

it('renders navItem correctly', () => {
  const stepsItem = navItem('steps')(theme.primaryColor);

  expect(stepsItem).toMatchSnapshot();
});
