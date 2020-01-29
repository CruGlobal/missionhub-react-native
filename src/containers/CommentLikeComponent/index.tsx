import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Text, Button } from '../../components/common';
import { trackActionWithoutData } from '../../actions/analytics';
import GREY_HEART from '../../../assets/images/heart-grey.png';
import BLUE_HEART from '../../../assets/images/heart-blue.png';
import COMMENTS from '../../../assets/images/comments.png';
import { toggleLike } from '../../actions/celebration';
import { ACTIONS } from '../../constants';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../CelebrateFeed/__generated__/GetCelebrateFeed';
import { AuthState } from '../../reducers/auth';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

export interface CommentLikeComponentProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  event: GetCelebrateFeed_community_celebrationItems_nodes;
  myId: string;
}

const CommentLikeComponent = ({
  dispatch,
  organization,
  event,
  myId,
}: CommentLikeComponentProps) => {
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);

  const { id, liked, likesCount, commentsCount, subjectPerson } = event;

  const onPressLikeIcon = async () => {
    try {
      setIsLikeDisabled(true);
      await dispatch(toggleLike(id, liked, organization && organization.id));
      !liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
    } finally {
      setIsLikeDisabled(false);
    }
  };

  const renderCommentIcon = () => {
    const displayCommentCount = commentsCount > 0;

    return (
      <>
        <Text style={styles.likeCount}>
          {displayCommentCount ? commentsCount : null}
        </Text>
        <Image source={COMMENTS} />
      </>
    );
  };

  const renderLikeIcon = () => {
    const displayLikeCount =
      likesCount > 0 && subjectPerson && subjectPerson.id === myId;

    return (
      <>
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
          <Image source={liked ? BLUE_HEART : GREY_HEART} />
        </Button>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {subjectPerson && renderCommentIcon()}
      {renderLikeIcon()}
    </View>
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  myId: auth.person.id,
});

export default connect(mapStateToProps)(CommentLikeComponent);
