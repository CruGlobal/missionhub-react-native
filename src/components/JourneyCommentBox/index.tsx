import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';

import CommentBox from '../CommentBox';
import { addNewInteraction } from '../../actions/interactions';
import { INTERACTION_TYPES } from '../../constants';

class JourneyCommentBox extends Component {
  submitInteraction = async (action, text) => {
    const { person, organization, dispatch, onSubmit } = this.props;
    const interaction = action || INTERACTION_TYPES.MHInteractionTypeNote;

    await dispatch(
      addNewInteraction(
        person.id,
        interaction,
        text,
        organization ? organization.id : undefined,
      ),
    );

    onSubmit && onSubmit();
  };

  render() {
    const { hideActions } = this.props;

    return (
      <CommentBox
        placeholderTextKey={'actions:commentBoxPlaceholder'}
        onSubmit={this.submitInteraction}
        hideActions={hideActions}
      />
    );
  }
}

export default connect()(JourneyCommentBox);
