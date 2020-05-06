import React, { useEffect } from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { CelebrateFeed } from '../CelebrateFeed';
import { orgIsGlobal } from '../../utils/common';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import BackButton from '../BackButton';
import theme from '../../theme';
import Header from '../../components/Header';
import PostTypeLabel, {
  PostLabelSizeEnum,
} from '../../components/PostTypeLabel';

const CelebrateFeedWithType = () => {
  const organization: string = useNavigationParam('organization');
  const type: FeedItemSubjectTypeEnum = useNavigationParam('type');
  const dispatch = useDispatch();
  // useAnalytics(['challenge', 'detail']);
  return (
    <View style={{ height: '100%' }}>
      <StatusBar {...theme.statusBar.darkContent} />
      <PostTypeLabel type={type} size={PostLabelSizeEnum.extraLarge} />
      <CelebrateFeed
        testID="CelebrateFeed"
        organization={organization}
        itemNamePressable={!orgIsGlobal(organization)}
        type={type}
      />
    </View>
  );
};

export default CelebrateFeedWithType;

export const CELEBRATE_FEED_WITH_TYPE_SCREEN =
  'nav/CELEBRATE_FEED_WITH_TYPE_SCREEN';
