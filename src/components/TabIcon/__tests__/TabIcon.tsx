import 'react-native';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';

import * as common from '../../../utils/common';
import { renderWithContext } from '../../../../testUtils';
import { GET_UNREAD_NOTIFICATION_STATUS } from '../queries';

import TabIcon from '..';

// Use fake timers for pollInterval
jest.useFakeTimers();

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
});

describe('renders', () => {
  it('correctly | NonAndroid', () => {
    renderWithContext(<TabIcon name={'steps'} tintColor={'blue'} />).snapshot();
  });

  it('correctly | Android', () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    renderWithContext(<TabIcon name={'steps'} tintColor={'blue'} />).snapshot();
  });

  it('steps', () => {
    renderWithContext(<TabIcon name={'steps'} tintColor={'blue'} />).snapshot();
  });

  it('steps different tint color', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'steps'} tintColor={'grey'} />,
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('people', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'people'} tintColor={'blue'} />,
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('communities', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'communities'} tintColor={'blue'} />,
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('notifications', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name="notifications" tintColor={'blue'} />,
      {
        mocks: {
          NotificationConnection: () => ({
            nodes: () =>
              new MockList(1, () => ({
                createdAt: '2020-05-29T11:19:26-03:00',
              })),
          }),
        },
        initialApolloState: {
          notificationState: {
            __typename: 'NotificationState',
            lastReadDateTime: '2020-05-29T11:19:26-03:00',
          },
        },
      },
    );

    await flushMicrotasksQueue();
    expect(useQuery).toHaveBeenCalledWith(GET_UNREAD_NOTIFICATION_STATUS, {
      pollInterval: 30000,
      skip: false,
    });
    snapshot();
  });

  it('notifications with notification dot', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name="notifications" tintColor={'blue'} />,
      {
        initialApolloState: {
          notificationState: {
            __typename: 'NotificationState',
            lastReadDateTime: '',
          },
        },
        mocks: {
          NotificationConnection: () => ({
            nodes: () =>
              new MockList(1, () => ({
                createdAt: '2020-05-29T11:19:26-03:00',
              })),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    expect(useQuery).toHaveBeenCalledWith(GET_UNREAD_NOTIFICATION_STATUS, {
      pollInterval: 30000,
      skip: false,
    });

    snapshot();
  });
});
