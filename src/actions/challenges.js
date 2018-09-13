// import { DEFAULT_PAGE_LIMIT, RESET_CHALLENGE_PAGINATION } from '../constants';

// import callApi, { REQUESTS } from './api';

// // TODO: Combine the logic for challenges and celebration because they are so similar
// export function getGroupChallengeFeed(orgId, personId = null) {
//   return (dispatch, getState) => {
//     const org = (getState().organizations.all || []).find(o => {
//       return o.id === orgId;
//     });

//     const { page, hasNextPage } = org.challengePagination
//       ? org.challengePagination
//       : { page: 0, hasNextPage: true };

//     if (!hasNextPage) {
//       // Does not have more data
//       return Promise.resolve();
//     }
//     const query = buildQuery(orgId, personId, page);
//     return dispatch(callApi(REQUESTS.GET_GROUP_CHALLENGE_FEED, query));
//   };
// }

// export function reloadGroupChallengeFeed(orgId) {
//   return (dispatch, getState) => {
//     const org = (getState().organizations.all || []).find(o => o.id === orgId);

//     if (org && org.challengePagination) {
//       dispatch(resetPaginationAction(orgId));
//       return dispatch(getGroupChallengeFeed(orgId));
//     }
//     return Promise.resolve();
//   };
// }

// const resetPaginationAction = orgId => ({
//   type: RESET_CHALLENGE_PAGINATION,
//   orgId,
// });

// function buildQuery(orgId, personId, page) {
//   return {
//     page: {
//       limit: DEFAULT_PAGE_LIMIT,
//       offset: DEFAULT_PAGE_LIMIT * page,
//     },
//     orgId,
//     ...(personId ? { filters: { subject_person_ids: personId } } : {}),
//   };
// }

// export function completeChallenge(item, orgId) {
//   let query = {
//     challengeId: item.id,
//   };
//   if (orgId) {
//     query.orgId = orgId;
//   }
//   return async dispatch => {
//     await dispatch(callApi(REQUESTS.COMPLETE_CHALLENGE, query));
//     return dispatch(reloadGroupChallengeFeed(orgId));
//   };
// }

// export function joinChallenge(item, orgId) {
//   let query = {
//     challengeId: item.id,
//   };
//   if (orgId) {
//     query.orgId = orgId;
//   }
//   return async dispatch => {
//     await dispatch(callApi(REQUESTS.JOIN_CHALLENGE, query));
//     return dispatch(reloadGroupChallengeFeed(orgId));
//   };
// }
