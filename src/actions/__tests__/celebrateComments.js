import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { reloadCelebrateComments } from '../celebrateComments';
import callApi, { REQUESTS } from '../api';

jest.mock('../api');

const event = { id: '80890', organization: { id: '645654' } };
const callApiResponse = { result: 'hello world' };

const mockStore = configureStore([thunk]);
let store;

callApi.mockReturnValue(() => callApiResponse);

beforeEach(() => (store = mockStore()));

describe('reloadCelebrateComments', () => {
  it('should send request with no page', async () => {
    const result = await store.dispatch(reloadCelebrateComments(event));

    expect(result).toEqual(callApiResponse);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_CELEBRATE_COMMENTS, {
      orgId: event.organization.id,
      eventId: event.id,
    });
  });
});
