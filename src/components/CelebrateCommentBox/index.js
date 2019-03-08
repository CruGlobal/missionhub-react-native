import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CommentBox from '../CommentBox';
import { createCelebrateComment } from '../../actions/celebrateComments';
import theme from '../../theme';

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
        containerStyle={{ backgroundColor: theme.grey3 }}
      />
    );
  }
}

CelebrateCommentBox.propTypes = {
  event: PropTypes.object.isRequired,
};

export default connect()(CelebrateCommentBox);
