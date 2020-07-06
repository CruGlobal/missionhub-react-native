import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../../../testUtils';
import CommunityReportedScreen from '../CommunityReported';
import { GET_CONTENT_COMPLAINT } from '../queries';

const mockReportedItemId = '1234';

describe('reported post screen', () => {
  it('render correctly', () => {
    const { snapshot } = renderWithContext(<CommunityReportedScreen />, {
      navParams: {
        reportedItemId: mockReportedItemId,
      },
      mocks: {
        ContentComplaintGroup: () => ({
          subject: () => ({
            __typename: 'Post',
          }),
        }),
      },
    });

    expect(useQuery).toHaveBeenCalledWith(GET_CONTENT_COMPLAINT, {
      variables: {
        id: mockReportedItemId,
      },
    });
    snapshot();
  });
});

describe('reported comment screen', () => {
  it('render correctly', () => {
    const { snapshot } = renderWithContext(<CommunityReportedScreen />, {
      navParams: {
        reportedItemId: mockReportedItemId,
      },
      mocks: {
        ContentComplaintGroup: () => ({
          subject: () => ({
            __typename: 'FeedItemComment',
          }),
        }),
      },
    });

    expect(useQuery).toHaveBeenCalledWith(GET_CONTENT_COMPLAINT, {
      variables: {
        id: mockReportedItemId,
      },
    });
    snapshot();
  });
});
