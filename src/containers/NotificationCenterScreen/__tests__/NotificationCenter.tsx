import React from 'react';
import { SectionList } from 'react-native';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useQuery } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';

import { renderWithContext } from '../../../../testUtils';
import { GET_NOTIFICATIONS } from '../queries';
import { openMainMenu } from '../../../utils/common';

import NotificationCenterScreen from '..';

jest.mock('../../../utils/common');

const openMainMenuResponse = { type: 'open main menu' };

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
  });

  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS);
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
      }),
    },
  });

  await flushMicrotasksQueue();
  expect(useQuery).toHaveBeenCalledWith(GET_NOTIFICATIONS);

  snapshot();
});

it('handles refresh', async () => {
  const { getByType } = renderWithContext(<NotificationCenterScreen />, {
    mocks: {
      NotificationConnection: () => ({
        nodes: () => new MockList(10),
      }),
    },
  });

  await flushMicrotasksQueue();
  fireEvent(getByType(SectionList), 'onRefresh');
});
