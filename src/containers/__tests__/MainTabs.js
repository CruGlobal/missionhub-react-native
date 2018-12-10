import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import theme from '../../theme';
import {
  createMockStore,
  testSnapshot,
  createMockNavState,
} from '../../../testUtils';
import { navItem } from '../..//AppRoutes';
import { communitiesSelector } from '../../selectors/organizations';
import MainTabs from '../../containers/MainTabs';

jest.mock('../../selectors/organizations');

const store = createMockStore({
  auth: {
    isFirstTime: false,
  },
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
});

communitiesSelector.mockReturnValue([]);

it('renders home screen with tab bar with steps tab selected correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabs navigation={createMockNavState({})} />
    </Provider>,
  );
});

it('renders home screen with tab bar with groups tab selected correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabs navigation={createMockNavState({ startTab: 'groups' })} />
    </Provider>,
  );
});

it('renders navItem correctly', () => {
  const stepsItem = navItem('steps')(theme.primaryColor);

  expect(stepsItem).toMatchSnapshot();
});
