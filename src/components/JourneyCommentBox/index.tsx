import React from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';

import CommentBox from '../CommentBox';
import { addNewInteraction } from '../../actions/interactions';
import { INTERACTION_TYPES } from '../../constants';
import { Person } from '../../reducers/people';

import { JOURNEY_COMMENT_BOX_QUERY } from './queries';
import { JourneyCommentBox as JourneyCommentBoxQuery } from './__generated__/JourneyCommentBox';

interface JourneyCommentBoxProps {
  person: Person;
  onSubmit?: () => void;
}

const JourneyCommentBox = ({ person, onSubmit }: JourneyCommentBoxProps) => {
  const { t } = useTranslation('actions');
  const dispatch = useDispatch();

  const { data } = useQuery<JourneyCommentBoxQuery>(JOURNEY_COMMENT_BOX_QUERY);

  const submitInteraction = (text: string) => {
    dispatch(
      addNewInteraction(
        person.id,
        INTERACTION_TYPES.MHInteractionTypeNote,
        text,
        undefined,
      ),
    );
    onSubmit && onSubmit();
  };

  return (
    <CommentBox
      avatarPerson={data?.currentUser.person}
      placeholderText={t('commentBoxPlaceholder')}
      onSubmit={submitInteraction}
    />
  );
};

export default connect()(JourneyCommentBox);
