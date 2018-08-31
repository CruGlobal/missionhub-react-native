import {
  LOGOUT,
  RESET_CELEBRATION_PAGINATION,
  SET_CELEBRATION_FEED,
  SET_CELEBRATION_ITEM_LIKE,
} from '../constants';
import { getPagination } from '../utils/common';

const initialState = {
  allById: {},
  ids: [],
};

function celebrationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CELEBRATION_FEED:
      return addToFeed(action, state);
    case RESET_CELEBRATION_PAGINATION:
      return resetOrgPagination(action, state);
    case SET_CELEBRATION_ITEM_LIKE:
      return setCelebrationLike(action, state);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function addToFeed(action, state) {
  const { page, feedId, newItems } = action;

  const existingFeed = state.allById[feedId] || {};
  const existingItems = existingFeed.items || [];
  const allItems =
    page && page.offset > 0 ? [...existingItems, ...newItems] : newItems;
  const newIds = state.ids;
  if (newIds.indexOf(feedId) === -1) {
    newIds.push(feedId);
  }

  return {
    ...state,
    allById: {
      ...state.allById,
      [feedId]: {
        ...existingFeed,
        items: allItems,
        id: feedId,
        pagination: getPagination(action, allItems.length),
      },
    },
    ids: newIds,
  };
}

function resetOrgPagination(action, state) {
  const { feedId } = action;
  return {
    ...state,
    allById: {
      ...state.allById,
      [feedId]: {
        ...state.allById[feedId],
        pagination: { page: 0, hasNextPage: true },
      },
    },
  };
}

function setCelebrationLike(action, state) {
  const { feedId, eventId, liked } = action;

  return {
    ...state,
    allById: {
      ...state.allById,
      [feedId]: {
        ...state.allById[feedId],
        items: state.allById[feedId].items.map(
          c =>
            c.id === eventId
              ? { ...c, liked, likes_count: c.likes_count + (liked ? 1 : -1) }
              : c,
        ),
      },
    },
  };
}

export default celebrationReducer;
