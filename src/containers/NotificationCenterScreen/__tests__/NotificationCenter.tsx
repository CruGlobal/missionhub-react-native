import React from 'react';
import { SectionList } from 'react-native';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';

import { renderWithContext } from '../../../../testUtils';
import { GET_NOTIFICATIONS, UPDATE_HAS_UNREAD_NOTIFICATIONS } from '../queries';
import { openMainMenu } from '../../../utils/common';

import NotificationCenterScreen from '..';

jest.mock('../../../utils/common');

const openMainMenuResponse = { type: 'open main menu' };

const initialApolloState = {
  notificationState: {
    __typename: 'NotificationState',
    hasUnreadNotifications: false,
    latestNotification: '',
  },
};

// Use fake timers for pollInterval
jest.useFakeTimers();

beforeEach(() => {
  (openMainMenu as jest.Mock).mockReturnValue(openMainMenuResponse);
});

it('renders with no data', async () => {
  const { snapshot } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () => [],
      }),
    },
    initialApolloState,
  });

  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS, {
    pollInterval: 30000,
  });
  expect(useMutation).toHaveBeenCalledWith(UPDATE_HAS_UNREAD_NOTIFICATIONS);
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
      }),
    },
    initialApolloState,
  });

  await flushMicrotasksQueue();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS, {
    pollInterval: 30000,
  });
  expect(useMutation).toHaveBeenCalledWith(UPDATE_HAS_UNREAD_NOTIFICATIONS);

  snapshot();
});

it('handles refresh', async () => {
  const { getByType } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
      }),
    },
    initialApolloState,
  });

  await flushMicrotasksQueue();
  fireEvent(getByType(SectionList), 'onRefresh');
  expect(useMutation).toHaveBeenCalledWith(UPDATE_HAS_UNREAD_NOTIFICATIONS);
});
