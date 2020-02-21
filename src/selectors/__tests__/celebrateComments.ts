import {
  celebrateCommentsSelector,
  celebrateCommentsCommentSelector,
} from '../celebrateComments';
import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../../reducers/celebrateComments';

const eventId = '2342';
const commentId = 'commentId1';
const comments: CelebrateComment[] = [
  {
    id: commentId,
    person: {},
    content: '',
    created_at: '2019-04-11T13:51:49.888',
    updated_at: '2019-04-11T13:51:49.888',
  },
];

const celebrateComments: CelebrateCommentsState = {
  all: {
    [eventId]: { comments, pagination: { page: 1, hasNextPage: false } },
    '234234135': {
      comments: [
        {
          id: 'wrong comment obj',
          person: {},
          content: '',
          created_at: '2019-04-11T13:51:49.888',
          updated_at: '2019-04-11T13:51:49.888',
        },
      ],
      pagination: { page: 1, hasNextPage: false },
    },
  },
  editingCommentId: null,
};

it('should return comments for matching event id', () => {
  expect(
    celebrateCommentsSelector({ celebrateComments }, { eventId }),
  ).toEqual({ comments, pagination: { page: 1, hasNextPage: false } });
});

it('should return comments for matching event id', () => {
  expect(
    celebrateCommentsCommentSelector(
      { celebrateComments },
      { eventId, commentId },
    ),
  ).toEqual(comments[0]);
});
