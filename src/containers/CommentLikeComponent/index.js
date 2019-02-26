import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Text, Flex, Button } from '../../components/common';
import { trackActionWithoutData } from '../../actions/analytics';
import GREY_HEART from '../../../assets/images/heart-grey.png';
import BLUE_HEART from '../../../assets/images/heart-blue.png';
import COMMENTS from '../../../assets/images/comments.png';
import { toggleLike } from '../../actions/celebration';
import { ACTIONS } from '../../constants';

import styles from './styles';

class CommentLikeComponent extends Component {
  onPressLikeIcon = () => {
    const { event, dispatch } = this.props;
    dispatch(toggleLike(event.organization.id, event.id, event.liked));
    !event.liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
  };

  render() {
    const { myId, event } = this.props;
    const { subject_person, likes_count, comments_count, liked } = event;

    if (!subject_person) {
      return null;
    }

    const displayLikeCount =
      likes_count > 0 && subject_person && subject_person.id === myId;

    return (
      subject_person && (
        <Flex direction={'row'} align="end" justify="end">
          <Text style={styles.likeCount}>{comments_count || 0}</Text>
          <Image source={COMMENTS} style={{ marginHorizontal: 10 }} />

          <Text style={styles.likeCount}>
            {displayLikeCount ? likes_count : null}
          </Text>
          <Button onPress={this.onPressLikeIcon} style={styles.icon}>
            <Image source={liked ? BLUE_HEART : GREY_HEART} />
          </Button>
        </Flex>
      )
    );
  }
}

CommentLikeComponent.propTypes = {
  event: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});
export default connect(mapStateToProps)(CommentLikeComponent);
