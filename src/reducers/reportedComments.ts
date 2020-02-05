import { AnyAction } from 'redux';

import { LOGOUT } from '../constants';
import { REQUESTS } from '../api/routes';

import { CelebrateComment } from './celebrateComments';

export interface ReportedCommentsState {
  all: {
    [key: string]: CelebrateComment[];
  };
}

const initialState: ReportedCommentsState = {
  all: {},
};

export default function reportedCommentsReducer(
  state = initialState,
  action: AnyAction,
) {
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
