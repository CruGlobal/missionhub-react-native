import { ACTIONS } from '../constants';
import { formatApiDate } from '../utils/common';

import callApi, { REQUESTS } from './api';
import { trackActionWithoutData } from './analytics';

export function reportComment(orgId, item) {
  return async (dispatch, getState) => {
    const { id: myId } = getState().auth.person;
    const commentId = item.id;
    const result = await dispatch(
      callApi(
        REQUESTS.CREATE_REPORT_COMMENT,
        { orgId },
        {
          data: {
            attributes: {
              comment_id: commentId,
              person_id: myId,
            },
          },
        },
      ),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_REPORTED));
    return result;
  };
}

export function ignoreReportComment(orgId, reportCommentId) {
  return dispatch =>
    dispatch(
      callApi(
        REQUESTS.UPDATE_REPORT_COMMENT,
        {
          orgId,
          reportCommentId,
        },
        {
          data: {
            attributes: { ignored_at: formatApiDate() },
          },
        },
      ),
    );
}

export function getReportedComments(orgId) {
  return dispatch =>
    dispatch(
      callApi(REQUESTS.GET_REPORTED_COMMENTS, {
        orgId,
        filters: { ignored: false },
        include: 'comment,comment.person,person',
      }),
    );
}
