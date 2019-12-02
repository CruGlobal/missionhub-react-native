import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  reportComment,
  ignoreReportComment,
  getReportedComments,
} from '../reportComments';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import { trackActionWithoutData } from '../analytics';
import { ACTIONS } from '../../constants';
import * as common from '../../utils/common';

jest.mock('../api');
jest.mock('../../selectors/celebrateComments');
jest.mock('../analytics');

const orgId = '645654';
const comment = { pagination: { page: 2, hasNextPage: true } };
const callApiResponse = { result: 'hello world' };
const celebrateComments = { someProp: 'asdfasdfasdf' };
const me = { id: 'myId' };
const trackActionResult = { type: 'tracked action' };

const mockStore = configureStore([thunk]);
let store;

callApi.mockReturnValue(() => callApiResponse);
celebrateCommentsSelector.mockReturnValue(comment);
trackActionWithoutData.mockReturnValue(trackActionResult);

beforeEach(() => {
  store = mockStore({ auth: { person: me }, celebrateComments });
});

describe('report comments', () => {
  const item = { id: 'comment1' };

  it('should callApi for report', async () => {
    const response = await store.dispatch(reportComment(orgId, item));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_REPORT_COMMENT,
      { orgId },
      { data: { attributes: { comment_id: item.id, person_id: me.id } } },
    );
    expect(response).toEqual(callApiResponse);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CELEBRATE_COMMENT_REPORTED,
    );
    expect(store.getActions()).toEqual([trackActionResult]);
  });

  it('should callApi for ignore', async () => {
    const fakeDate = '2018-09-06T14:13:21Z';
    common.formatApiDate = jest.fn(() => fakeDate);

    const response = await store.dispatch(ignoreReportComment(orgId, item.id));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_REPORT_COMMENT,
      { orgId, reportCommentId: item.id },
      { data: { attributes: { ignored_at: fakeDate } } },
    );
    expect(response).toEqual(callApiResponse);
  });

  it('should callApi for get reported comments', async () => {
    const response = await store.dispatch(getReportedComments(orgId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_REPORTED_COMMENTS,
      { orgId },
      {
        filters: { ignored: false },
        include: 'comment,comment.person,person',
      },
    );
    expect(response).toEqual(callApiResponse);
  });
});
