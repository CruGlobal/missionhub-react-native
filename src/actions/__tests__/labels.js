import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getMyLabels, getOrgFilterStats } from '../labels';

jest.mock('../api');

const apiResponse = { type: 'successful' };

let store;

const organization_id = '123';

beforeEach(() => {
  store = configureStore([thunk])();
  callApi.mockReturnValue(apiResponse);
});

it('should get my labels', () => {
  store.dispatch(getMyLabels());

  expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_MY_LABELS, {
    limit: 100,
  });
  expect(store.getActions()).toEqual([apiResponse]);
});

it('should get labels for people in org', () => {
  store.dispatch(getOrgFilterStats(organization_id));

  expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATION_FILTER_STATS, {
    organization_id,
  });
  expect(store.getActions()).toEqual([apiResponse]);
});
