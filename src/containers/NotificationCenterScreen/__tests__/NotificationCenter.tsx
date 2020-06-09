import React from 'react';
import { SectionList } from 'react-native';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';
import { GET_NOTIFICATIONS, UPDATE_HAS_UNREAD_NOTIFICATIONS } from '../queries';
import { openMainMenu } from '../../../utils/common';

import NotificationCenterScreen from '..';

jest.mock('../../../utils/common');

const mockDate = '2020-05-20 12:00:00 PM GMT+0';

MockDate.set(mockDate);
const openMainMenuResponse = { type: 'open main menu' };

const initialApolloState = {
  notificationState: {
    __typename: 'NotificationState',
    hasUnreadNotifications: false,
    latestNotification: '',
  },
};

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
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS);
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
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS);
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

it('renders Today section correctly ', async () => {
  const { snapshot } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () =>
          new MockList(1, () => ({
            createdAt: '2020-05-20 11:00:00 AM GMT+0',
          })),
      }),
    },
    initialApolloState,
  });

  await flushMicrotasksQueue();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS);
  expect(useMutation).toHaveBeenCalledWith(UPDATE_HAS_UNREAD_NOTIFICATIONS);

  snapshot();
});

it('renders Earlier section correctly ', async () => {
  const { snapshot } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () =>
          new MockList(1, () => ({
            createdAt: '2020-05-18 12:00:00 PM GMT+0',
          })),
      }),
    },
    initialApolloState,
  });

  await flushMicrotasksQueue();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS);
  expect(useMutation).toHaveBeenCalledWith(UPDATE_HAS_UNREAD_NOTIFICATIONS);

  snapshot();
});

describe('handle pagination', () => {
  let mocks = {};
  const testScroll = async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <NotificationCenterScreen />,
      {
        initialApolloState,
        mocks,
      },
    );

    await flushMicrotasksQueue();

    const scrollDown = () =>
      fireEvent(getByTestId('notificationCenter'), 'onEndReached');
    return {
      scrollDown,
      recordSnapshot,
      diffSnapshot,
      flushMicrotasksQueue,
    };
  };

  it('paginates when close to bottom', async () => {
    mocks = {
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
        pageInfo: () => ({ hasNextPage: true }),
      }),
    };

    const {
      scrollDown,
      recordSnapshot,
      diffSnapshot,
      flushMicrotasksQueue,
    } = await testScroll();

    recordSnapshot();

    scrollDown();

    await flushMicrotasksQueue();

    diffSnapshot();
  });

  it('should not load more when no next page', async () => {
    mocks = {
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
        pageInfo: () => ({ hasNextPage: false }),
      }),
    };
    const {
      scrollDown,
      recordSnapshot,
      diffSnapshot,
      flushMicrotasksQueue,
    } = await testScroll();

    recordSnapshot();

    scrollDown();

    await flushMicrotasksQueue();

    diffSnapshot();
  });
});
