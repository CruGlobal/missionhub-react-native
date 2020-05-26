import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { NotificationTriggerEnum } from '../../../../__generated__/globalTypes';

import NotificationCenterItem from '..';

const mockEvent = {
  id: '1234',
  __typename: 'Notification' as 'Notification',
  messageTemplate: 'A new story has been added in <<organization_name>>',
  messageVariables: {
    __typename: 'NotificationMessageVariables' as 'NotificationMessageVariables',
    challengeName: null,
    organizationName: 'Bleh 2.0',
    organizationCount: null,
    originalPoster: null,
    postType: null,
    subjectPerson: null,
    user: null,
  },
  subjectPerson: {
    __typename: 'Person' as 'Person',
    fullName: 'Christian Huffman',
    id: '12345',
    picture: 'mockProfilePic.jpeg',
  },
  trigger: NotificationTriggerEnum.story_notification,
  createdAt: '2020-05-18T17:48:43Z',
};

it('renders correctly', () => {
  renderWithContext(<NotificationCenterItem event={mockEvent} />).snapshot();
});
