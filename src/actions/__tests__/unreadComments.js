import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { markCommentsRead, checkForUnreadComments } from '../unreadComments';
import { getMe } from '../person';

jest.mock('../api');
jest.mock('../person');
callApi.mockReturnValue(() => {
  result: 'marked as unread';
});
getMe.mockReturnValue(() => {
  type: 'reloaded person';
});

const unreadCommentsQuery = {
  include: 'organizational_permissions,organizational_permissions.organization',
  'fields[person]': 'organizational_permissions,unread_comments_count',
  'fields[organizational_permissions]': 'organization',
  'fields[organization]': 'unread_comments_count',
};

let store;

beforeEach(() => {
  store = configureStore([thunk])();
});

describe('markCommentsRead', () => {
  const orgId = 4;

  beforeEach(async () => {
    await store.dispatch(markCommentsRead(orgId));
  });

  it("should send a request to mark an org's comments as read", () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
      organization_id: orgId,
    });
  });

  it('should send a request to refresh unread comments notification', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION,
      unreadCommentsQuery,
    );
  });
});

describe('updateCommentNotification', () => {
  beforeEach(() => {
    store.dispatch(checkForUnreadComments());
  });

  it('makes API request GET_UNREAD_COMMENTS_NOTIFICATION', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION,
      unreadCommentsQuery,
    );
  });
});
