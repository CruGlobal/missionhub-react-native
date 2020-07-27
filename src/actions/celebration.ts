import { apolloClient } from '../apolloClient';
import {
  GET_COMMUNITY_FEED,
  GET_GLOBAL_COMMUNITY_FEED,
} from '../containers/CommunityFeed/queries';

export const getCelebrateFeed = async (
  communityId: string,
  personId?: string,
  hasUnreadComments?: boolean,
) => {
  await apolloClient.query({
    query: GET_COMMUNITY_FEED,
    variables: {
      communityId,
      personIds: personId,
      hasUnreadComments,
    },
  });
};

export const getGlobalCommunityFeed = async () => {
  await apolloClient.query({
    query: GET_GLOBAL_COMMUNITY_FEED,
  });
};
