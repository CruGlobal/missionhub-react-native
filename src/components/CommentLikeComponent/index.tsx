import React, { useState } from 'react';
import { GestureResponderEvent, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';

import { Button } from '../common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { PostTypeEnum } from '../../../__generated__/globalTypes';
import theme from '../../theme';
import { navigatePush } from '../../actions/navigation';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';

import CommentIcon from './commentIcon.svg';
import HeartIcon from './heartIcon.svg';
import PrayerIcon from './prayerIcon.svg';
import PrayerIconActive from './prayerIconActive.svg';
import styles from './styles';
import { CommunityFeedItemCommentLike } from './__generated__/CommunityFeedItemCommentLike';
import { SET_FEED_ITEM_LIKE_MUTATION } from './queries';
import {
  SetFeedItemLike,
  SetFeedItemLikeVariables,
} from './__generated__/SetFeedItemLike';

interface CommentLikeComponentProps {
  feedItem: CommunityFeedItemCommentLike;
  hideComment?: boolean;
  onCommentPress?: (event: GestureResponderEvent) => void;
  testID?: string;
}

export const CommentLikeComponent = ({
  feedItem,
  hideComment = false,
  onCommentPress,
}: CommentLikeComponentProps) => {
  const {
    id,
    comments: {
      pageInfo: { totalCount: commentsCount },
    },
    liked,
    likesCount,
    subject,
    subjectPerson,
  } = feedItem;
  const isPrayer =
    subject.__typename === 'Post' &&
    subject.postType === PostTypeEnum.prayer_request;

  const dispatch = useDispatch();
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);
  const isMe = useIsMe(subjectPerson?.id || '');

  const [setLike] = useMutation<SetFeedItemLike, SetFeedItemLikeVariables>(
    SET_FEED_ITEM_LIKE_MUTATION,
    { variables: { id, liked: !liked } },
  );

  const handleCommentPress = () =>
    dispatch(
      navigatePush(FEED_ITEM_DETAIL_SCREEN, {
        feedItemId: feedItem.id,
      }),
    );

  const onPressLikeIcon = async () => {
    try {
      setIsLikeDisabled(true);
      await setLike();
      !liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
    } finally {
      setIsLikeDisabled(false);
    }
  };

  const renderCommentIcon = () => {
    const displayCommentCount = commentsCount > 0;

    return (
      <View style={styles.commentWrap}>
        <Text style={styles.likeCount}>
          {displayCommentCount ? commentsCount : null}
        </Text>
        <Button
          testID="CommentIconButton"
          type="transparent"
          onPress={onCommentPress || handleCommentPress}
          viewProps={{ hitSlop: theme.hitSlop(25) }}
        >
          <CommentIcon />
        </Button>
      </View>
    );
  };

  const renderLikeIcon = () => {
    const displayLikeCount = isMe && likesCount > 0;

    return (
      <View style={styles.likeWrap}>
        <Text style={styles.likeCount}>
          {displayLikeCount ? likesCount : null}
        </Text>
        <Button
          testID="LikeIconButton"
          type="transparent"
          disabled={isLikeDisabled}
          onPress={onPressLikeIcon}
          style={styles.likeIcon}
          viewProps={{ hitSlop: theme.hitSlop(25) }}
        >
          {isPrayer ? (
            liked ? (
              <PrayerIconActive color={theme.communityPrayerRequestPurple} />
            ) : (
              <PrayerIcon color={theme.textColor} />
            )
          ) : (
            <HeartIcon
              color={liked ? theme.orange : theme.textColor}
              fill={liked ? theme.orange : undefined}
            />
          )}
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderLikeIcon()}
      {hideComment ? null : renderCommentIcon()}
    </View>
  );
};
