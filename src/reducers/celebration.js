import { REQUESTS } from '../actions/api';
import { getPagination } from '../utils/common';

const initialCelebrationState = {
  items: [],
  pagination: {
    hasNextPage: true,
    page: 1,
  },
};

function celebrationReducer(state = initialCelebrationState, action) {
  switch (action.type) {
    case REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS:
      const newItems = action.results.response;
      console.log(newItems);

      const allItems =
        action.query.page && action.query.page.offset > 0
          ? [...(state.items || []), ...newItems]
          : newItems;

      return {
        ...state,
        items: allItems,
        pagination: getPagination(action, allItems.length),
      };
    case LOGOUT:
      return initialCelebrationState;
    default:
      return state;
  }
}

export default celebrationReducer;
