import React from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';

import CommentBox, { ActionItem } from '../CommentBox';
import { addNewInteraction } from '../../actions/interactions';
import { INTERACTION_TYPES } from '../../constants';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';

interface JourneyCommentBoxProps {
  person: Person;
  organization: Organization;
  onSubmit?: () => void;
  showInteractions?: boolean;
}

const JourneyCommentBox = ({
  person,
  organization,
  onSubmit,
  showInteractions,
}: JourneyCommentBoxProps) => {
  const dispatch = useDispatch();

  const submitInteraction = (action: ActionItem | null, text: string) => {
    const interaction = action || INTERACTION_TYPES.MHInteractionTypeNote;

    dispatch(
      addNewInteraction(
        person.id,
        interaction,
        text,
        organization ? organization.id : undefined,
      ),
    );
    onSubmit && onSubmit();
  };

  return (
    <CommentBox
      placeholderTextKey={'actions:commentBoxPlaceholder'}
      onSubmit={submitInteraction}
      showInteractions={showInteractions}
    />
  );
};

export default connect()(JourneyCommentBox);
