import React from 'react';
import { View, StatusBar } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';

import { CelebrateFeed } from '../CelebrateFeed';
import { orgIsGlobal } from '../../utils/common';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import theme from '../../theme';
import PostTypeLabel, {
  PostLabelSizeEnum,
} from '../../components/PostTypeLabel';
import { Organization } from '../../reducers/organizations';
import { RootState } from '../../reducers';
import { organizationSelector } from '../../selectors/organizations';

const CelebrateFeedWithType = () => {
  const communityId: string = useNavigationParam('communityId');
  const organization: Organization = useNavigationParam('organization');
  const type: FeedItemSubjectTypeEnum = useNavigationParam('type');
  const selectorOrg = useSelector(({ organizations }: RootState) =>
    organizationSelector({ organizations }, { orgId: communityId }),
  );
  return (
    <View style={{ height: '100%' }}>
      <StatusBar {...theme.statusBar.lightContent} />
      <PostTypeLabel type={type} size={PostLabelSizeEnum.extraLarge} />
      <CelebrateFeed
        organization={organization || selectorOrg}
        itemNamePressable={!orgIsGlobal(organization)}
        filteredFeedType={type}
      />
    </View>
  );
};

export default CelebrateFeedWithType;

export const CELEBRATE_FEED_WITH_TYPE_SCREEN =
  'nav/CELEBRATE_FEED_WITH_TYPE_SCREEN';
