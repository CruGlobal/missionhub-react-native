import { createSelector } from 'reselect';

export const celebrateCommentsSelector = createSelector(
  ({ celebrateComments }) => celebrateComments.all,
  (_, { eventId }) => eventId,
  (events, eventId) => events[eventId],
);

export const celebrateCommentsCommentSelector = createSelector(
  ({ celebrateComments }) => celebrateComments.all,
  (_, { eventId }) => eventId,
  (_, { commentId }) => commentId,
  (events, eventId, commentId) =>
    ((events[eventId] || {}).comments || []).find(c => c.id === commentId),
);
