import React from 'react';

import { renderWithContext } from '../../../../../../testUtils';
import { CommunityFeedTab } from '../CommunityFeedTab';
import { CommunitiesCollapsibleHeaderContext } from '../../CommunityHeader/CommunityHeader';
import { useAnalytics } from '../../../../../utils/hooks/useAnalytics';
import { PermissionEnum } from '../../../../../../__generated__/globalTypes';
import { getAnalyticsPermissionType } from '../../../../../utils/analytics';

jest.mock('../../../../CommunityFeed', () => ({
  CommunityFeed: 'CommunityFeed',
}));
jest.mock('../../../../../utils/analytics');
jest.mock('../../../../../utils/hooks/useAnalytics');

const communityId = '1';
const personId = '2';
const permissionType = PermissionEnum.owner;

const initialState = {
  organizations: { all: [{ id: communityId }] },
};

(getAnalyticsPermissionType as jest.Mock).mockReturnValue(permissionType);

it('should render correctly', () => {
  renderWithContext(
    <CommunityFeedTab
      collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
    />,
    { initialState, navParams: { communityId, personId } },
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('community feed', {
    permissionType: { communityId },
  });
});
