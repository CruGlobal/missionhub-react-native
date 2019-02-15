import React, { Component } from 'react';
import { connect } from 'react-redux';

import CommentBox from '../CommentBox';
import { addNewInteraction } from '../../actions/interactions';
import { INTERACTION_TYPES } from '../../constants';

class InteractionCommentBox extends Component {
  submitInteraction = async (action, text) => {
    const { person, organization, dispatch, onSubmit } = this.props;

    const interaction = action
      ? action
      : INTERACTION_TYPES.MHInteractionTypeNote;

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
      <CommentBox onSubmit={this.submitInteraction} hideActions={hideActions} />
    );
  }
}

export default connect()(InteractionCommentBox);
