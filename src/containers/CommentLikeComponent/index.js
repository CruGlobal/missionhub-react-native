import React, { Component, Fragment } from 'react';
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
    const {
      event: { organization, id, liked },
      dispatch,
    } = this.props;

    dispatch(toggleLike(organization && organization.id, id, liked));
    !liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
  };

  renderCommentSection() {
    const {
      event: { comments_count },
    } = this.props;

    return (
      <Fragment>
        <Text style={styles.likeCount}>{comments_count || 0}</Text>
        <Image source={COMMENTS} style={{ marginHorizontal: 10 }} />
      </Fragment>
    );
  }

  render() {
    const { myId, event, style } = this.props;
    const { subject_person, likes_count, liked } = event;

    const displayLikeCount =
      likes_count > 0 && subject_person && subject_person.id === myId;

    return (
      <Flex direction={'row'} align="end" justify="end" style={style}>
        {subject_person && this.renderCommentSection()}
        <Text style={styles.likeCount}>
          {displayLikeCount ? likes_count : null}
        </Text>
        <Button onPress={this.onPressLikeIcon} style={styles.icon}>
          <Image source={liked ? BLUE_HEART : GREY_HEART} />
        </Button>
      </Flex>
    );
  }
}

CommentLikeComponent.propTypes = {
  event: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});
export default connect(mapStateToProps)(CommentLikeComponent);
