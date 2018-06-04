import { REQUESTS } from '../actions/api';
import { LOGOUT, GET_ORGANIZATION_MEMBERS } from '../constants';

import { getPagination } from './steps';

const initialState = {
  all: [],
  members: {}, // The key is the orgId and then it has an array of members
  membersPagination: {
    hasNextPage: true,
    page: 1,
  },
};

function groupsReducer(state = initialState, action) {
  const results = action.results;
  switch (action.type) {
    case REQUESTS.GET_MY_GROUPS.SUCCESS:
      const groups = (results.findAll('group') || []).map(g => ({
        text: g.name,
        ...g,
      }));
      return {
        ...state,
        all: groups,
      };
    case GET_ORGANIZATION_MEMBERS:
      const { orgId, members } = action;
      // If we're doing paging, concat the old steps with the new ones
      const allMembers =
        action.query &&
        action.query.page &&
        action.query.page.offset > 0 &&
        state.members[orgId]
          ? [...state.members[orgId], ...members]
          : members;

      return {
        ...state,
        members: {
          ...state.members,
          [orgId]: allMembers,
        },
        membersPagination: getPagination(action, allMembers.length),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default groupsReducer;
