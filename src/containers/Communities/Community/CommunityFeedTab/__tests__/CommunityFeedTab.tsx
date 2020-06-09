import React from 'react';

import { renderWithContext } from '../../../../../../testUtils';
import { CommunityFeedTab } from '../CommunityFeedTab';
import { CommunitiesCollapsibleHeaderContext } from '../../CommunityHeader/CommunityHeader';
import { useAnalytics } from '../../../../../utils/hooks/useAnalytics';
import { PermissionEnum } from '../../../../../../__generated__/globalTypes';
import { ANALYTICS_PERMISSION_TYPE } from '../../../../../constants';
import { getAnalyticsAssignmentType } from '../../../../../utils/analytics';

jest.mock('../../../../CommunityFeed', () => 'CommunityFeed');
jest.mock('../../../../../utils/analytics');
jest.mock('../../../../../utils/hooks/useAnalytics');

const communityId = '1';
const personId = '2';
const permissionType = PermissionEnum.owner;

const initialState = {
  organizations: { all: [{ id: communityId }] },
  auth: { person: { id: personId } },
};

(getAnalyticsAssignmentType as jest.Mock).mockReturnValue(permissionType);

it('should render correctly', () => {
  renderWithContext(
    <CommunityFeedTab
      collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
    />,
    { initialState, navParams: { communityId, personId } },
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: permissionType },
  });
});
