import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Text, Button } from '../common';
import { trackActionWithoutData } from '../../actions/analytics';
import { toggleLike } from '../../actions/celebration';
import { ACTIONS } from '../../constants';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { CombinedFeedItem } from '../CommunityFeedItem';
import { CommunityFeedPost } from '../CommunityFeedItem/__generated__/CommunityFeedPost';
import { PostTypeEnum } from '../../../__generated__/globalTypes';
import theme from '../../theme';

import CommentIcon from './commentIcon.svg';
import HeartIcon from './heartIcon.svg';
import PrayerIcon from './prayerIcon.svg';
import styles from './styles';

export interface CommentLikeComponentProps {
  communityId: string;
  item: CombinedFeedItem;
  onRefresh: () => void;
}

export const CommentLikeComponent = ({
  communityId,
  item,
  onRefresh,
}: CommentLikeComponentProps) => {
  const {
    id,
    comments: {
      pageInfo: { totalCount: commentsCount },
    },
    liked,
    likesCount,
    subjectPerson,
    subject,
  } = item;
  const isPrayer =
    subject.__typename === 'Post' &&
    (subject as CommunityFeedPost).postType === PostTypeEnum.prayer_request;

  const dispatch = useDispatch();
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);
  const isMe = useIsMe(subjectPerson?.id || '');

  const onPressLikeIcon = async () => {
    try {
      setIsLikeDisabled(true);
      await dispatch(toggleLike(id, liked, communityId));
      !liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
    } finally {
      setIsLikeDisabled(false);
      onRefresh();
    }
  };

  const renderCommentIcon = () => {
    const displayCommentCount = commentsCount > 0;

    return (
      <View style={styles.iconAndCountWrap}>
        <Text style={styles.likeCount}>
          {displayCommentCount ? commentsCount : null}
        </Text>
        <CommentIcon />
      </View>
    );
  };

  const renderLikeIcon = () => {
    const displayLikeCount = isMe && likesCount > 0;

    return (
      <View style={styles.iconAndCountWrap}>
        <Text style={styles.likeCount}>
          {displayLikeCount ? likesCount : null}
        </Text>
        <Button
          testID="LikeIconButton"
          type="transparent"
          disabled={isLikeDisabled}
          onPress={onPressLikeIcon}
          style={styles.icon}
        >
          {isPrayer ? (
            <PrayerIcon
              color={
                liked ? theme.communityPrayerRequestPurple : theme.textColor
              }
            />
          ) : (
            <HeartIcon
              color={liked ? theme.red : theme.textColor}
              fill={liked ? theme.red : undefined}
            />
          )}
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderLikeIcon()}
      {renderCommentIcon()}
    </View>
  );
};
