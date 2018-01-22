import { keyLogin } from '../../src/actions/auth';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as callApi from '../../src/actions/api';
import * as constants from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import * as analytics from '../../src/actions/analytics';
import * as people from '../../src/actions/people';
import { ANALYTICS_CONTEXT_CHANGED } from '../../src/constants';

const email = 'Roger';
const password = 'secret';
const mockClientId = 123456;
const ticket = 'nfnvjvkfkfj886';
const data = `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${email}&password=${password}`;
const mockStore = configureStore([thunk]);

constants.THE_KEY_CLIENT_ID = mockClientId;

callApi.default = jest.fn().mockImplementation(
  function(type) {
    return (dispatch) => {
      return dispatch(() => {
        if (type === REQUESTS.KEY_GET_TICKET) {
          return Promise.resolve({ ticket: ticket });
        } else {
          return Promise.resolve({});
        }
      });
    };
  },
);

const loggedInAction = { type: ANALYTICS_CONTEXT_CHANGED, loggedInStatus: true };
analytics.updateLoggedInStatus = jest.fn().mockReturnValue(loggedInAction);

const users = [ { pathway_stage_id: 5 } ];
const peopleAction = { type: 'people', findAll: () => users };
people.getMe = jest.fn().mockReturnValue(peopleAction);

const peopleList = [ { reverse_contact_assignments: [ { pathway_stage_id: 1 }] }];
const peopleListAction = { type: 'people list', findAll: () => peopleList };
people.getPeopleList = jest.fn().mockReturnValue(peopleListAction);

//TODO: try to re-write this with fewer expectations
it('should login to the key, then get a key ticket, then send the key ticket to Missionhub API, then update logged-in status', () => {
  const store = mockStore({});

  return store.dispatch(keyLogin(email, password))
    .then(() => {
      expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_LOGIN, {}, data);
      expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_GET_TICKET, {}, {});
      expect(callApi.default).toHaveBeenCalledWith(REQUESTS.TICKET_LOGIN, {}, { code: ticket });

      expect(store.getActions()[0]).toBe(loggedInAction);
      expect(store.getActions()[1]).toBe(peopleAction);
    });
});