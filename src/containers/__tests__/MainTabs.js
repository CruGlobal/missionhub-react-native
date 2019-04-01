import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import theme from '../../theme';
import {
  createThunkStore,
  testSnapshot,
  createMockNavState,
} from '../../../testUtils';
import { navItem } from '../../AppRoutes';
import { communitiesSelector } from '../../selectors/organizations';
import MainTabs from '../../containers/MainTabs';

jest.mock('../../selectors/organizations');

const state = {
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
    journey: true,
  },
  organizations: {
    all: [],
  },
};
let store;

communitiesSelector.mockReturnValue([]);

beforeEach(() => {
  store = createThunkStore(state);
});

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
