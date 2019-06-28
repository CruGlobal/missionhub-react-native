import { LOGOUT } from '../constants';
import { REQUESTS } from '../api/routes';

const initialState = {
  all: {},
};

export default function reportedCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.GET_REPORTED_COMMENTS.SUCCESS:
      const {
        query: { orgId: reportedCommentsOrgId },
        results: { response: reportedComments = [] },
      } = action;
      return {
        ...state,
        all: {
          ...state.all,
          [reportedCommentsOrgId]: reportedComments,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
