import {
  celebrateCommentsSelector,
  celebrateCommentsCommentSelector,
} from '../celebrateComments';

const eventId = '2342';
const commentId = 'commentId1';
const comments = [{ id: commentId }];

const celebrateComments = {
  all: {
    [eventId]: { comments },
    '234234135': { comments: [{ id: 'wrong comment obj' }] },
  },
  editingCommentId: null,
};

it('should return comments for matching event id', () => {
  expect(
    celebrateCommentsSelector({ celebrateComments }, { eventId }),
  ).toEqual({ comments });
});

it('should return comments for matching event id', () => {
  expect(
    celebrateCommentsCommentSelector(
      { celebrateComments },
      { eventId, commentId },
    ),
  ).toEqual(comments[0]);
});
