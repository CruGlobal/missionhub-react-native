import React from 'react';
import { View, Alert, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import i18n from 'i18next';

import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Touchable, Icon } from '../common';
import { CommunityFeedItemContent } from '../CommunityFeedItemContent';
import Avatar from '../Avatar';
import {
  CREATE_POST_SCREEN,
  CreatePostScreenNavParams,
} from '../../containers/Groups/CreatePostScreen';
import { useIsMe } from '../../utils/hooks/useIsMe';
import {
  CommunityFeedItem as FeedItemFragment,
  CommunityFeedItem_subject,
  CommunityFeedItem_subject_Post,
} from '../CommunityFeedItem/__generated__/CommunityFeedItem';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import {
  GetCommunityFeed,
  GetCommunityFeedVariables,
} from '../../containers/CommunityFeed/__generated__/GetCommunityFeed';
import { GET_COMMUNITY_FEED } from '../../containers/CommunityFeed/queries';
import { getFeedItemType, canModifyFeedItemSubject } from '../../utils/common';
import { GET_ME } from '../../containers/OnboardingAddPhotoScreen';
import { GetMe } from '../../containers/OnboardingAddPhotoScreen/__generated__/GetMe';
import { RootState } from '../../reducers';
import { StoredPost } from '../../reducers/communityPosts';

import styles from './styles';
import { DeletePost, DeletePostVariables } from './__generated__/DeletePost';
import { DELETE_POST, REPORT_POST } from './queries';
import { ReportPost, ReportPostVariables } from './__generated__/ReportPost';

interface PendingFeedItemProps {
  pendingItemId: string;
}

export const PendingFeedItem = ({ pendingItemId }: PendingFeedItemProps) => {
  const { media }: StoredPost = useSelector(
    ({ communityPosts }: RootState) =>
      communityPosts.pendingPosts[pendingItemId],
  );

  const handleRetry = () => {};

  const handleCancel = () => {};

  return (
    <Card testID="PendingFeedItem" style={styles.container}>
      <Image style={{ height: 48, width: 48 }} source={{ uri: media }} />
    </Card>
  );
};
