import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CommentBox from '../CommentBox';
import { createCelebrateComment } from '../../actions/celebrateComments';

import styles from './styles';

class CelebrateCommentBox extends Component {
  submitComment = (action, text) => {
    const { dispatch, event } = this.props;

    dispatch(createCelebrateComment(event, text));
  };

  render() {
    return (
      <CommentBox
        placeholderTextKey={'celebrateCommentBox:placeholder'}
        onSubmit={this.submitComment}
        hideActions={true}
        containerStyle={styles.container}
      />
    );
  }
}

CelebrateCommentBox.propTypes = {
  event: PropTypes.object.isRequired,
};

export default connect()(CelebrateCommentBox);
