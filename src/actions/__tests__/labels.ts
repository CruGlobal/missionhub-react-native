import { createThunkStore } from '../../../testUtils';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getMyLabels, getOrgFilterStats } from '../labels';

jest.mock('../api');

const apiResponse = { type: 'successful' };

// @ts-ignore
let store;

const organization_id = '123';

beforeEach(() => {
  store = createThunkStore();
  // @ts-ignore
  callApi.mockReturnValue(apiResponse);
});

it('should get my labels', () => {
  // @ts-ignore
  store.dispatch(getMyLabels());

  expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_LABELS, {
    limit: 100,
  });
  // @ts-ignore
  expect(store.getActions()).toEqual([apiResponse]);
});

it('should get labels for people in org', () => {
  // @ts-ignore
  store.dispatch(getOrgFilterStats(organization_id));

  expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATION_FILTER_STATS, {
    organization_id,
  });
  // @ts-ignore
  expect(store.getActions()).toEqual([apiResponse]);
});
