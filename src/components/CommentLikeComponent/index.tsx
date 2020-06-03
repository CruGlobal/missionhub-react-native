import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';

import { Text, Button } from '../common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { PostTypeEnum } from '../../../__generated__/globalTypes';
import theme from '../../theme';

import CommentIcon from './commentIcon.svg';
import HeartIcon from './heartIcon.svg';
import PrayerIcon from './prayerIcon.svg';
import styles from './styles';
import { CommunityFeedItemCommentLike } from './__generated__/CommunityFeedItemCommentLike';
import { SET_FEED_ITEM_LIKE_MUTATION } from './queries';
import {
  SetFeedItemLike,
  SetFeedItemLikeVariables,
} from './__generated__/SetFeedItemLike';

export interface CommentLikeComponentProps {
  feedItem: CommunityFeedItemCommentLike;
}

export const CommentLikeComponent = ({
  feedItem,
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
