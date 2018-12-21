import profile from '../profile';
import { REQUESTS } from '../../actions/api';
import { STASH_COMMUNITY_TO_JOIN } from '../../constants';

const testNameSaved = type => {
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
    },
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

it('stashes the community for later', () => {
  const state = profile(
    {},
    {
      type: STASH_COMMUNITY_TO_JOIN,
      community: { id: '1' },
    },
  );

  expect(state).toEqual({
    community: { id: '1' },
  });
});
