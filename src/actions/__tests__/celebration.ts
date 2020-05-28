import { apolloClient } from '../../apolloClient';
import { getCelebrateFeed } from '../celebration';
import callApi from '../api';
import { GET_COMMUNITY_FEED } from '../../containers/CelebrateFeed/queries';

jest.mock('../api');

apolloClient.query = jest.fn();

const orgId = '123';
const personId = '333';

const apiResult = { type: 'done' };

beforeEach(() => {
  (callApi as jest.Mock).mockReturnValue(apiResult);
});

describe('getCelebrateFeed', () => {
  it('should get group celebrate feed', async () => {
    await getCelebrateFeed(orgId);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITY_FEED,
      variables: {
        communityId: orgId,
        personIds: undefined,
        hasUnreadComments: undefined,
      },
    });
  });

  it('should get member celebrate feed', () => {
    getCelebrateFeed(orgId, personId);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITY_FEED,
      variables: {
        communityId: orgId,
        personIds: personId,
        hasUnreadComments: undefined,
      },
    });
  });

  it('should get unread comments feed', () => {
    getCelebrateFeed(orgId, undefined, true);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITY_FEED,
      variables: {
        communityId: orgId,
        personIds: undefined,
        hasUnreadComments: true,
      },
    });
  });
});
