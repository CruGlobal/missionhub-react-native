import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi, { REQUESTS } from '../api';
import { markCommentsRead } from '../unreadComments';

jest.mock('../api');
callApi.mockReturnValue(() => {
  result: 'marked as unread';
});

describe('markCommentsRead', () => {
  it("should send a request to mark an org's comments as read", () => {
    const orgId = 4;
    const { dispatch } = configureStore([thunk])();

    dispatch(markCommentsRead(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
      organization_id: orgId,
    });
  });
});
