import React, { Component, Fragment } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Text, Button } from '../../components/common';
import { trackActionWithoutData } from '../../actions/analytics';
import GREY_HEART from '../../../assets/images/heart-grey.png';
import BLUE_HEART from '../../../assets/images/heart-blue.png';
import COMMENTS from '../../../assets/images/comments.png';
import { toggleLike } from '../../actions/celebration';
import { ACTIONS } from '../../constants';

import styles from './styles';

class CommentLikeComponent extends Component {
  state = { isLikeDisabled: false };

  onPressLikeIcon = async () => {
    const {
      event: { organization, id, liked },
      dispatch,
    } = this.props;

    try {
      this.setState({ isLikeDisabled: true });
      await dispatch(toggleLike(organization && organization.id, id, liked));
      !liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
    } finally {
      this.setState({ isLikeDisabled: false });
    }
  };

  renderCommentIcon() {
    const {
      event: { comments_count },
    } = this.props;
    const displayCommentCount = comments_count > 0;

    return (
      <Fragment>
        <Text style={styles.likeCount}>
          {displayCommentCount ? comments_count : null}
        </Text>
        <Image source={COMMENTS} />
      </Fragment>
    );
  }

  renderLikeIcon() {
    const { myId, event } = this.props;
    const { subject_person, likes_count, liked } = event;
    const { isLikeDisabled } = this.state;

    const displayLikeCount =
      likes_count > 0 && subject_person && subject_person.id === myId;

    return (
      <Fragment>
        <Text style={styles.likeCount}>
          {displayLikeCount ? likes_count : null}
        </Text>
        <Button
          type="transparent"
          disabled={isLikeDisabled}
          onPress={this.onPressLikeIcon}
          style={styles.icon}
        >
          <Image source={liked ? BLUE_HEART : GREY_HEART} />
        </Button>
      </Fragment>
    );
  }

  render() {
    const { event } = this.props;
    const { subject_person } = event;

    return (
      <View flexDirection={'row'} alignItems="center" justifyContent="flex-end">
        {subject_person && this.renderCommentIcon()}
        {this.renderLikeIcon()}
      </View>
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
