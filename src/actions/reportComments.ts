/* eslint-disable @typescript-eslint/no-explicit-any */

import { ThunkDispatch } from 'redux-thunk';
import gql from 'graphql-tag';

import { ACTIONS } from '../constants';
import { formatApiDate } from '../utils/common';
import { REQUESTS } from '../api/routes';
import { CelebrateComment } from '../reducers/celebrateComments';
import { AuthState } from '../reducers/auth';
import { apolloClient } from '../apolloClient';

import callApi from './api';
import { trackActionWithoutData } from './analytics';

export const GET_REPORTED_COMMENTS_AND_STORIES = gql`
  query GetReportedCommentsAndStories($id: ID!) {
    community(id: $id) {
      contentComplaints(ignored: false) {
        nodes {
          id
          subject {
            __typename
            ... on Story {
              content
              createdAt
              author {
                fullName
              }
            }
            ... on CommunityCelebrationItemComment {
              content
              createdAt
              person {
                fullName
              }
            }
          }
          person {
            fullName
          }
        }
      }
    }
  }
`;

export function reportComment(orgId: string, item: CelebrateComment) {
  return async (
    dispatch: ThunkDispatch<{}, {}, any>,
    getState: () => { auth: AuthState },
  ) => {
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

export function ignoreReportComment(orgId: string, reportCommentId: string) {
  return (dispatch: ThunkDispatch<{}, {}, any>) =>
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

export function getReportedComments(orgId: string) {
  return (dispatch: ThunkDispatch<{}, {}, any>) =>
    dispatch(
      callApi(REQUESTS.GET_REPORTED_COMMENTS, {
        orgId,
        filters: { ignored: false },
        include: 'comment,comment.person,person',
      }),
    );
}

export function getReportedCommentsAndStories(orgId: string) {
  return apolloClient.query({
    query: GET_REPORTED_COMMENTS_AND_STORIES,
    variables: {
      id: orgId,
    },
  });
}
