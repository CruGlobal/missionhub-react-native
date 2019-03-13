import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CommentBox from '../CommentBox';
import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../actions/celebrateComments';
import { celebrationItemSelector } from '../../selectors/celebration';

import styles from './styles';

class CelebrateCommentBox extends Component {
  componentWillUnmount() {
    this.cancel();
  }

  submitComment = (action, text) => {
    const { dispatch, event, editingComment } = this.props;

    if (editingComment) {
      this.cancel();
      return dispatch(updateCelebrateComment(editingComment, text));
    }

    return dispatch(createCelebrateComment(event, text));
  };

  cancel = () => {
    this.props.dispatch(resetCelebrateEditingComment());
  };

  render() {
    return (
      <CommentBox
        placeholderTextKey={'celebrateCommentBox:placeholder'}
        onSubmit={this.submitComment}
        hideActions={true}
        editingComment={this.props.editingComment}
        onCancel={this.cancel}
        containerStyle={styles.container}
      />
    );
  }
}

CelebrateCommentBox.propTypes = {
  event: PropTypes.object.isRequired,
  editingComment: PropTypes.object,
};

const mapStateToProps = ({ organizations, celebrateComments }, { event }) => ({
  editingComment: celebrateComments.editingComment,
  event:
    celebrationItemSelector(
      { organizations },
      { eventId: event.id, organizationId: event.organization.id },
    ) || event,
});

export default connect(mapStateToProps)(CelebrateCommentBox);
