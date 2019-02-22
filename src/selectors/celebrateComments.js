import { createSelector } from 'reselect';

export const celebrateCommentsSelector = createSelector(
  ({ celebrateComments }) => celebrateComments.all,
  (_, { eventId }) => eventId,
  (events, eventId) => events[eventId],
);
