import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi, { REQUESTS } from '../api';
import { markCommentsRead } from '../unreadComments';
import { getMe } from '../person';

jest.mock('../api');
jest.mock('../person');
callApi.mockReturnValue(() => {
  result: 'marked as unread';
});
getMe.mockReturnValue(() => {
  type: 'reloaded person';
});

describe('markCommentsRead', () => {
  it("should send a request to mark an org's comments as read", async () => {
    const orgId = 4;
    const { dispatch } = configureStore([thunk])();

    await dispatch(markCommentsRead(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.MARK_ORG_COMMENTS_AS_READ, {
      organization_id: orgId,
    });

    expect(getMe).toHaveBeenCalled();
  });
});
