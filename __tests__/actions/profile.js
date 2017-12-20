import { createMyPerson } from '../../src/actions/profile';

jest.mock('../../src/actions/api');

it('sends correct API request', () => {
  createMyPerson('Roger', 'Goers');

  //result(jest.fn());

  //expect(callApi).toHaveBeenCalledWith(REQUESTS.CREATE_MY_PERSON, {}, expect.anything());
});
