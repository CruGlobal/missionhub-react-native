import React from 'react';
import { useSelector } from 'react-redux';
import { View, StatusBar } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';

import { CommunityFeed } from '../CommunityFeed';
import { orgIsGlobal } from '../../utils/common';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import theme from '../../theme';
import PostTypeLabel, {
  PostLabelSizeEnum,
} from '../../components/PostTypeLabel';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import {
  getPostTypeAnalytics,
  getAnalyticsPermissionType,
} from '../../utils/analytics';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { AuthState } from '../../reducers/auth';
import { OrganizationsState } from '../../reducers/organizations';
import { organizationSelector } from '../../selectors/organizations';

const CommunityFeedWithType = () => {
  const communityId: string = useNavigationParam('communityId');
  const communityName: string = useNavigationParam('communityName');
  const type: FeedItemSubjectTypeEnum = useNavigationParam('type');

  const organization = useSelector(
    ({ organizations }: { organizations: OrganizationsState }) =>
      organizationSelector({ organizations }, { orgId: communityId }),
  );

  const analyticsPermissionType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsPermissionType(auth, organization),
  );

  useAnalytics(['feed', 'card', getPostTypeAnalytics(type)], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
    },
  });

  return (
    <View style={{ height: '100%' }}>
      <StatusBar {...theme.statusBar.lightContent} />
      <PostTypeLabel
        communityName={communityName}
        type={type}
        size={PostLabelSizeEnum.extraLarge}
      />
      <CommunityFeed
        communityId={communityId}
        itemNamePressable={!orgIsGlobal({ id: communityId })}
        filteredFeedType={type}
      />
    </View>
  );
};

export default CommunityFeedWithType;

export const COMMUNITY_FEED_WITH_TYPE_SCREEN =
  'nav/COMMUNITY_FEED_WITH_TYPE_SCREEN';
