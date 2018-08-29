import { LOGOUT, RESET_CELEBRATION_PAGINATION } from '../constants';
import { REQUESTS } from '../actions/api';
import { getPagination } from '../utils/common';

const initialState = {
  allOrgFeeds: {},
  allPersonFeeds: {},
};

function celebrationReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS:
      return addToOrgFeed(action, state);
    case RESET_CELEBRATION_PAGINATION:
      return resetOrgPagination(action, state);
    case REQUESTS.LIKE_CELEBRATE_ITEM.SUCCESS:
      return toggleCelebrationLike(action, state, true);
    case REQUESTS.UNLIKE_CELEBRATE_ITEM.SUCCESS:
      return toggleCelebrationLike(action, state, false);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function addToOrgFeed(action, state) {
  const query = action.query;
  const orgId = query.orgId;
  const newItems = action.results.response;

  const existingFeed = state.allOrgFeeds[orgId] || {};
  const existingItems = existingFeed.items || [];
  const allItems =
    query.page && query.page.offset > 0
      ? [...existingItems, ...newItems]
      : newItems;

  return {
    ...state,
    allOrgFeeds: {
      ...state.allOrgFeeds,
      [orgId]: {
        ...existingFeed,
        items: allItems,
        pagination: getPagination(action, allItems.length),
      },
    },
  };
}

function resetOrgPagination(action, state) {
  const orgId = action.orgId;
  return {
    ...state,
    allOrgFeeds: {
      ...state.allOrgFeeds,
      [orgId]: {
        ...state.allOrgFeeds[orgId],
        pagination: { page: 0, hasNextPage: true },
      },
    },
  };
}

function toggleCelebrationLike(action, state, liked) {
  const query = action.query;
  const org = state.all.find(o => o.id === query.orgId);
  if (!org) {
    return state; // Return if the organization does not exist
  }
  const newOrg = {
    ...org,
    celebrateItems: org.celebrateItems.map(
      c =>
        c.id === query.eventId
          ? { ...c, liked, likes_count: c.likes_count + (liked ? 1 : -1) }
          : c,
    ),
  };

  return {
    ...state,
    all: state.all.map(o => (o.id === query.orgId ? newOrg : o)),
  };
}

export default celebrationReducer;
