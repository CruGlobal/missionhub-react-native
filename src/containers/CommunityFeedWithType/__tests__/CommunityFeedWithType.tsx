import 'react-native';
import React from 'react';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { ORG_PERMISSIONS } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';

import CelebrateFeedWithType from '..';

jest.mock('../../CommunityFeed', () => ({ CommunityFeed: 'CommunityFeed' }));
jest.mock('../../../utils/hooks/useAnalytics');

const communityId = '1';
const myId = '2';
const initialState = {
  organizations: { all: [{ id: communityId }] },
  auth: {
    person: {
      id: myId,
      organizational_permissions: [
        { organization_id: communityId, permission_id: ORG_PERMISSIONS.USER },
      ],
    },
  },
};

it('renders correctly', () => {
  renderWithContext(<CelebrateFeedWithType />, {
    initialState,
    navParams: {
      type: FeedItemSubjectTypeEnum.STEP,
      communityId,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    ['feed', 'card', 'steps of faith'],
    {
      permissionType: { communityId },
    },
  );
});
