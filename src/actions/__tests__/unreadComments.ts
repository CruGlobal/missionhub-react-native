import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { markCommentsRead, markCommentRead } from '../unreadComments';
import { getMe } from '../person';
import { getCelebrateFeed } from '../celebration';
import { refreshCommunity, getMyCommunities } from '../organizations';

jest.mock('../api');
jest.mock('../person');
jest.mock('../celebration');
jest.mock('../organizations');
(callApi as jest.Mock).mockReturnValue(() => {
  result: 'marked as unread';
});
(getMe as jest.Mock).mockReturnValue(() => {
  type: 'reloaded person';
});
(getCelebrateFeed as jest.Mock).mockReturnValue(() => {
  type: 'get celebrate feed';
});
(refreshCommunity as jest.Mock).mockReturnValue(() => {
  type: 'refresh community';
});
(getMyCommunities as jest.Mock).mockReturnValue(() => {
  type: 'get my communities';
});

const orgId = '4';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;

beforeEach(() => {
  store = configureStore([thunk])();
});

describe('markCommentsRead', () => {
  beforeEach(async () => {
    await store.dispatch(markCommentsRead(orgId));
  });

  it("should send a request to mark an org's comments as read", () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
      organization_id: orgId,
    });
  });

  it('should refresh community', () => {
    expect(refreshCommunity).toHaveBeenCalledWith(orgId);
  });

  it('should refresh community unread comments feed', () => {
    expect(getCelebrateFeed).toHaveBeenCalledWith(orgId, undefined, true);
  });
});

describe('markCommentRead', () => {
  const eventId = '4';

  beforeEach(async () => {
    await store.dispatch(markCommentRead(eventId, orgId));
  });

  it('should send a request to mark events comments as read', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
      organization_celebration_item_id: eventId,
    });
  });

  it('should refresh community', () => {
    expect(refreshCommunity).toHaveBeenCalledWith(orgId);
  });

  it('should refresh community unread comments feed', () => {
    expect(getCelebrateFeed).toHaveBeenCalledWith(orgId, undefined, true);
  });
});
