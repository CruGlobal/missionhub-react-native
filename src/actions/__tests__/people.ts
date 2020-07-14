import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getMyPeople } from '../people';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';

jest.mock('../api');

const mockStore = configureStore([thunk]);
// @ts-ignore
let store;

const myId = 23;
const mockUser = {
  id: myId,
  name: 'Test User',
};

describe('getMyPeople', () => {
  const peopleQuery = {
    filters: {
      assigned_tos: 'me',
    },
    page: {
      limit: 1000,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };

  const peopleList = [
    {
      id: 123,
      organizational_permissions: [],
      reverse_contact_assignments: [{ assigned_to: { id: myId } }],
    },
  ];

  it('should return one org with people', async () => {
    // @ts-ignore
    callApi.mockReturnValue({
      type: REQUESTS.GET_PEOPLE_LIST.SUCCESS,
      response: peopleList,
    });
    store = mockStore({
      auth: {
        person: mockUser,
      },
    });

    // @ts-ignore
    await store.dispatch(getMyPeople());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, peopleQuery);
    expect(store.getActions()[1]).toMatchSnapshot();
  });
});
