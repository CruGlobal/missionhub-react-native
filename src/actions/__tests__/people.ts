import { getMyPeople } from '../people';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { createThunkStore } from '../../../testUtils';
import { getAuthPerson } from '../../auth/authUtilities';

jest.mock('../api');
jest.mock('../../auth/authUtilities');

const store = createThunkStore();

const myId = 23;
const authPerson = {
  id: myId,
  name: 'Test User',
};

(getAuthPerson as jest.Mock).mockReturnValue(authPerson);

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
    (callApi as jest.Mock).mockReturnValue({
      type: REQUESTS.GET_PEOPLE_LIST.SUCCESS,
      response: peopleList,
    });

    // @ts-ignore
    await store.dispatch(getMyPeople());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, peopleQuery);
    expect(store.getActions()[1]).toMatchSnapshot();
  });
});
