import React from 'react';
import { useNavigationEvents } from 'react-navigation-hooks';
import { SectionList } from 'react-native';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';
import { GET_NOTIFICATIONS, UPDATE_LATEST_NOTIFICATION } from '../queries';
import { openMainMenu } from '../../../utils/common';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { useFeatureFlags } from '../../../utils/hooks/useFeatureFlags';
import { GET_MY_AVATAR_AND_EMAIL } from '../../../components/SideMenu/queries';

import NotificationCenterScreen from '..';

jest.mock('../../../utils/common');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../utils/hooks/useFeatureFlags');
jest.mock('react-navigation-hooks');

const mockDate = '2020-05-20 12:00:00 PM GMT+0';

MockDate.set(mockDate);
const openMainMenuResponse = { type: 'open main menu' };

const initialApolloState = {
  notificationState: {
    __typename: 'NotificationState',
    lastReadDateTime: '',
  },
};

beforeEach(() => {
  (openMainMenu as jest.Mock).mockReturnValue(openMainMenuResponse);
  (useFeatureFlags as jest.Mock).mockReturnValue({ notifications_panel: true });
  (useNavigationEvents as jest.Mock).mockReturnValue({
    action: { type: 'Navigation/JUMP_TO' },
  });
});

it('renders with no data', () => {
  const { snapshot } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () => [],
      }),
    },
    initialApolloState,
  });

  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS, {
    onCompleted: expect.any(Function),
  });

  expect(useAnalytics).toHaveBeenCalledWith('notification center');
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
    onCompleted: expect.any(Function),
  });
  expect(useQuery).toHaveBeenCalledWith(GET_MY_AVATAR_AND_EMAIL, {
    fetchPolicy: 'cache-first',
  });

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('notification center');
});

it('renders null for non-english users', async () => {
  (useFeatureFlags as jest.Mock).mockReturnValue({});

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
    onCompleted: expect.any(Function),
  });

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('notification center');
});

it('renders with refresh button', async () => {
  const { snapshot } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () => [],
      }),
      NotificationState: () => ({
        lastReadDateTime: () => '2020-05-20 10:00:00 AM GMT+0',
      }),
    },
    initialApolloState,
  });

  await flushMicrotasksQueue();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS, {
    onCompleted: expect.any(Function),
  });

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('notification center');
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
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS, {
    onCompleted: expect.any(Function),
  });
  expect(useMutation).toHaveBeenMutatedWith(UPDATE_LATEST_NOTIFICATION, {
    variables: {
      latestNotification: '2020-05-20 11:00:00 AM GMT+0',
    },
  });

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
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS, {
    onCompleted: expect.any(Function),
  });
  expect(useMutation).toHaveBeenMutatedWith(UPDATE_LATEST_NOTIFICATION, {
    variables: {
      latestNotification: '2020-05-18 12:00:00 PM GMT+0',
    },
  });

  snapshot();
});

it('should open main menu', async () => {
  const { getByTestId, store } = renderWithContext(
    <NotificationCenterScreen />,
    {
      initialApolloState,
    },
  );
  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('menuButton'));
  expect(openMainMenu).toHaveBeenCalledWith();
  expect(store.getActions()).toEqual([openMainMenuResponse]);
});

describe('handle pagination', () => {
  const testScroll = async (mocks = {}) => {
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
    const {
      scrollDown,
      recordSnapshot,
      diffSnapshot,
      flushMicrotasksQueue,
    } = await testScroll({
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
        pageInfo: () => ({ hasNextPage: true }),
      }),
    });

    recordSnapshot();

    scrollDown();

    await flushMicrotasksQueue();

    diffSnapshot();
  });

  it('should not load more when no next page', async () => {
    const {
      scrollDown,
      recordSnapshot,
      diffSnapshot,
      flushMicrotasksQueue,
    } = await testScroll({
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
        pageInfo: () => ({ hasNextPage: false }),
      }),
    });

    recordSnapshot();

    scrollDown();

    await flushMicrotasksQueue();

    diffSnapshot();
  });
});
