import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';

import CommentBox from '../CommentBox';
import { addNewInteraction } from '../../actions/interactions';
import { INTERACTION_TYPES } from '../../constants';

class JourneyCommentBox extends Component {
  // @ts-ignore
  submitInteraction = async (action, text) => {
    // @ts-ignore
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
    // @ts-ignore
    const { hideActions } = this.props;

    return (
      <CommentBox
        // @ts-ignore
        placeholderTextKey={'actions:commentBoxPlaceholder'}
        onSubmit={this.submitInteraction}
        hideActions={hideActions}
      />
    );
  }
}

export default connect()(JourneyCommentBox);
