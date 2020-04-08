import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { useDispatch } from 'react-redux';

import HEART_ACTIVE_ICON from '../../../assets/images/heartActiveIcon.png';
import HEART_INACTIVE_ICON from '../../../assets/images/heartInactiveIcon.png';
import PRAYER_ACTIVE_ICON from '../../../assets/images/prayerActiveIcon.png';
import PRAYER_INACTIVE_ICON from '../../../assets/images/prayerInactiveIcon.png';
import COMMENT_ICON from '../../../assets/images/commentIcon.png';
import { Text, Button } from '../../components/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { toggleLike } from '../../actions/celebration';
import { ACTIONS } from '../../constants';
import { Organization } from '../../reducers/organizations';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../CelebrateFeed/__generated__/GetCelebrateFeed';

import styles from './styles';

export interface CommentLikeComponentProps {
  organization: Organization;
  event: GetCelebrateFeed_community_celebrationItems_nodes;
  onRefresh: () => void;
  isPrayer: boolean;
}

export const CommentLikeComponent = ({
  organization,
  event,
  onRefresh,
  isPrayer,
}: CommentLikeComponentProps) => {
  const dispatch = useDispatch();
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);

  const { id, liked, likesCount, commentsCount, subjectPerson } = event;

  const isMe = useIsMe(subjectPerson?.id || '');

  const onPressLikeIcon = async () => {
    try {
      setIsLikeDisabled(true);
      await dispatch(toggleLike(id, liked, organization && organization.id));
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
        <Image source={COMMENT_ICON} />
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
          <Image
            source={
              isPrayer
                ? liked
                  ? PRAYER_ACTIVE_ICON
                  : PRAYER_INACTIVE_ICON
                : liked
                ? HEART_ACTIVE_ICON
                : HEART_INACTIVE_ICON
            }
          />
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderLikeIcon()}
      {subjectPerson && renderCommentIcon()}
    </View>
  );
};
