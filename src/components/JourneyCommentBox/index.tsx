import React from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';

import CommentBox, { ActionItem } from '../CommentBox';
import { addNewInteraction } from '../../actions/interactions';
import { INTERACTION_TYPES } from '../../constants';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import { useTranslation } from 'react-i18next';

interface JourneyCommentBoxProps {
  person: Person;
  organization: Organization | null;
  onSubmit?: () => void;
  showInteractions?: boolean;
}

const JourneyCommentBox = ({
  person,
  organization,
  onSubmit,
  showInteractions,
}: JourneyCommentBoxProps) => {
  const { t } = useTranslation('actions');
  const dispatch = useDispatch();

  const submitInteraction = (text: string) => {
    dispatch(
      addNewInteraction(
        person.id,
        INTERACTION_TYPES.MHInteractionTypeNote,
        text,
        organization ? organization.id : undefined,
      ),
    );
    onSubmit && onSubmit();
  };

  return (
    <CommentBox
      placeholderText={t('commentBoxPlaceholder')}
      onSubmit={submitInteraction}
      showInteractions={showInteractions}
    />
  );
};

export default connect()(JourneyCommentBox);
