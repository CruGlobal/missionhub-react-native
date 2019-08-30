import { createSelector } from 'reselect';

import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../reducers/celebrateComments';

export const celebrateCommentsSelector = createSelector(
  ({ celebrateComments }: { celebrateComments: CelebrateCommentsState }) =>
    celebrateComments.all,
  (
    _: { celebrateComments: CelebrateCommentsState },
    { eventId }: { eventId: string },
  ) => eventId,
  (events, eventId) => events[eventId],
);

export const celebrateCommentsCommentSelector = createSelector(
  ({ celebrateComments }: { celebrateComments: CelebrateCommentsState }) =>
    celebrateComments.all,
  (
    _: { celebrateComments: CelebrateCommentsState },
    { eventId }: { eventId: string; commentId?: string | null },
  ) => eventId,
  (
    _: { celebrateComments: CelebrateCommentsState },
    { commentId }: { eventId: string; commentId?: string | null },
  ) => commentId,
  (events, eventId, commentId) =>
    ((events[eventId] || {}).comments || []).find(
      (c: CelebrateComment) => c.id === commentId,
    ),
);
