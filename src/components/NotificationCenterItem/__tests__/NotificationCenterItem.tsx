import React from 'react';

import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { renderWithContext } from '../../../../testUtils';
import { NOTIFICATION_ITEM_FRAGMENT } from '../queries';
import { NotificationItem } from '../__generated__/NotificationItem';

import NotificationCenterItem from '..';
import { NotificationTriggerEnum } from '../.../../../../../__generated__/globalTypes';

it('renders correctly', () => {
  renderWithContext(
    <NotificationCenterItem
      event={mockFragment<NotificationItem>(NOTIFICATION_ITEM_FRAGMENT, {
        mocks: {
          Notification: () => ({
            messageTemplate: () =>
              'A new story has been added in <<community_name>>',
            trigger: () => NotificationTriggerEnum.story_notification,
            messageVariables: () => ({
              communityName: 'Bleh 2.0',
            }),
          }),
        },
      })}
    />,
  ).snapshot();
});
