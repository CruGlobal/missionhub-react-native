import React from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';

import CommentBox from '../CommentBox';
import { addNewInteraction } from '../../actions/interactions';
import { INTERACTION_TYPES } from '../../constants';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';

interface JourneyCommentBoxProps {
  person: Person;
  organization: Organization;
  onSubmit?: () => void;
  hideActions?: boolean;
}

const JourneyCommentBox = ({
  person,
  organization,
  onSubmit,
  hideActions,
}: JourneyCommentBoxProps) => {
  const dispatch = useDispatch();

  const submitInteraction = (action: any, text: string) => {
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
      hideActions={hideActions}
    />
  );
};

export default connect()(JourneyCommentBox);
