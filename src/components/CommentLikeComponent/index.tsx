import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Text, Button } from '../common';
import { trackActionWithoutData } from '../../actions/analytics';
import { toggleLike } from '../../actions/celebration';
import { ACTIONS } from '../../constants';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { CommunityPost } from '../CommunityFeedItem/__generated__/CommunityPost';

import CommentIcon from './commentIcon.svg';
import HeartActiveIcon from './heartActiveIcon.svg';
import HeartInactiveIcon from './heartInactiveIcon.svg';
import PrayerActionIcon from './prayerActiveIcon.svg';
import PrayerInactiveIcon from './prayerInactiveIcon.svg';
import styles from './styles';

export interface CommentLikeComponentProps {
  orgId: string;
  post: CommunityPost;
  onRefresh: () => void;
  isPrayer: boolean;
}

export const CommentLikeComponent = ({
  orgId,
  post,
  onRefresh,
  isPrayer,
}: CommentLikeComponentProps) => {
  const { id, liked, likesCount, commentsCount, subjectPerson } = post;

  const dispatch = useDispatch();
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);
  const isMe = useIsMe(subjectPerson?.id || '');

  const onPressLikeIcon = async () => {
    try {
      setIsLikeDisabled(true);
      await dispatch(toggleLike(id, liked, orgId));
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
    const displayLikeCount = likesCount > 0 && isMe;

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
            liked ? (
              <PrayerActionIcon />
            ) : (
              <PrayerInactiveIcon />
            )
          ) : liked ? (
            <HeartActiveIcon />
          ) : (
            <HeartInactiveIcon />
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
