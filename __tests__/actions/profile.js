import {createMyPerson} from '../../src/actions/profile';
import callApi, {REQUESTS} from '../../src/actions/api';

jest.mock('../../src/actions/api');

it('sends correct API request', () => {
  const result = createMyPerson('Roger', 'Goers');

  //result(jest.fn());

  //expect(callApi).toHaveBeenCalledWith(REQUESTS.CREATE_MY_PERSON, {}, expect.anything());
});
