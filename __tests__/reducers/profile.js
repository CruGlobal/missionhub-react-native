import profile from '../../src/reducers/profile';
import { REQUESTS } from '../../src/actions/api';

const testNameSaved = (type) => {
  const firstName = 'Roger';
  const lastName = 'Goers';

  const state = profile(
    {},
    {
      type: type,
      results: {
        first_name: firstName,
        last_name: lastName,
      },
    }
  );

  expect(state.firstName).toBe(firstName);
  expect(state.lastName).toBe(lastName);
};

it('saves first and last name after creating person', () => {
  testNameSaved(REQUESTS.CREATE_MY_PERSON.SUCCESS);
});

it('saves first and last name after logging in with ticket', () => {
  testNameSaved(REQUESTS.TICKET_LOGIN.SUCCESS);
});