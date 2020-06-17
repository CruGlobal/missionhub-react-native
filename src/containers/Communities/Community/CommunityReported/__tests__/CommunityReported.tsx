import React from 'react';

import { renderWithContext } from '../../../../../../testUtils';
import { mockFragment } from '../../../../../../testUtils/apolloMockClient';
import { ContentComplaintGroupItem } from '../../../../../components/NotificationCenterItem/__generated__/ContentComplaintGroupItem';
import { CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT } from '../../../../../components/NotificationCenterItem/queries';
import CommunityReportedScreen from '../CommunityReported';

const mockReportedComment = mockFragment<ContentComplaintGroupItem>(
  CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
  {
    mocks: {
      ContentComplaintGroup: () => ({
        subject: () => ({
          __typename: 'FeedItemComment',
        }),
      }),
    },
  },
);
const mockReportedPost = mockFragment<ContentComplaintGroupItem>(
  CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT,
  {
    mocks: {
      ContentComplaintGroup: () => ({
        subject: () => ({
          __typename: 'Post',
        }),
      }),
    },
  },
);

describe('reported post screen', () => {
  it('render correctly', () => {
    renderWithContext(<CommunityReportedScreen />, {
      navParams: mockReportedPost,
    }).snapshot();
  });
});

describe('reported comment screen', () => {
  it('render correctly', () => {
    renderWithContext(<CommunityReportedScreen />, {
      navParams: mockReportedComment,
    }).snapshot();
  });
});
