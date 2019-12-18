import React, { useEffect } from 'react';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import CommentBox from '../CommentBox';
import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../actions/celebrateComments';
import { celebrationItemSelector } from '../../selectors/celebration';
import { celebrateCommentsCommentSelector } from '../../selectors/celebrateComments';
import { OrganizationsState } from '../../reducers/organizations';
import { CelebrateCommentsState } from '../../reducers/celebrateComments';

import styles from './styles';

interface CelebrateCommentBoxProps {
  event: object;
  editingComment?: object;
  onAddComplete?: () => void;
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const CelebrateCommentBox = ({
  event,
  editingComment,
  onAddComplete,
  dispatch,
}: CelebrateCommentBoxProps) => {
  // Make sure we run "cancel" when component unmounts
  useEffect(() => () => cancel(), []);

  const submitComment = async (action: object, text: string) => {
    if (editingComment) {
      cancel();
      return dispatch(updateCelebrateComment(editingComment, text));
    }
    const results = await dispatch(createCelebrateComment(event, text));
    onAddComplete && onAddComplete();
    return results;
  };

  const cancel = () => {
    dispatch(resetCelebrateEditingComment());
  };

  return (
    <CommentBox
      testID="CelebrateCommentBox"
      placeholderTextKey={'celebrateCommentBox:placeholder'}
      onSubmit={submitComment}
      hideActions={true}
      editingComment={editingComment}
      onCancel={cancel}
      containerStyle={styles.container}
    />
  );
};
const mapStateToProps = (
  {
    organizations,
    celebrateComments,
  }: {
    organizations: OrganizationsState;
    celebrateComments: CelebrateCommentsState;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { event }: any,
) => ({
  editingComment: celebrateCommentsCommentSelector(
    { celebrateComments },
    { eventId: event.id, commentId: celebrateComments.editingCommentId },
  ),
  event:
    celebrationItemSelector(
      { organizations },
      { eventId: event.id, organizationId: event.organization.id },
    ) || event,
});

export default connect(mapStateToProps)(CelebrateCommentBox);
