import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import theme from '../../theme';
import { testSnapshot, renderShallow } from '../../../testUtils';
import { navItem } from '../../AppRoutes';
import { loadHome } from '../../actions/auth/userData';
import { communitiesSelector } from '../../selectors/organizations';
import MainTabs from '../../containers/MainTabs';

jest.mock('../../selectors/organizations');
jest.mock('../../actions/auth/userData');

const state = {
  auth: {
    isFirstTime: false,
    person: { user: { hidden_organizations: [] } },
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

beforeEach(() => {
  store = configureStore([thunk])(state);
  communitiesSelector.mockReturnValue([]);
  loadHome.mockReturnValue({ type: 'load home' });
});

it('renders home screen with tab bar with steps tab selected correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabs navigation={{ state: { params: {} } }} />
    </Provider>,
  );
});

it('renders home screen with tab bar with people tab selected correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabs navigation={{ state: { params: { startTab: 'people' } } }} />
    </Provider>,
  );
});

it('renders home screen with tab bar with groups tab selected correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <MainTabs navigation={{ state: { params: { startTab: 'groups' } } }} />
    </Provider>,
  );
});

it('renders navItem correctly', () => {
  const stepsItem = navItem('steps')(theme.primaryColor);

  expect(stepsItem).toMatchSnapshot();
});

it('calls loadHome on mount', () => {
  renderShallow(<MainTabs navigation={{ state: { params: {} } }} />, store);

  expect(loadHome).toHaveBeenCalled();
});
