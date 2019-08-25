import { celebrateCommentsSelector } from '../celebrateComments';

const eventId = '2342';
const comments = { id: eventId };

const celebrateComments = {
  all: {
    [eventId]: comments,
    '234234135': { id: 'wrong comment obj' },
  },
  editingCommentId: null,
};

it('should return comments for matching event id', () => {
  expect(celebrateCommentsSelector({ celebrateComments }, { eventId })).toEqual(
    comments,
  );
});
