import people from '../../src/reducers/people';
import { REQUESTS } from '../../src/actions/api';
import { PEOPLE_WITH_ORG_SECTIONS } from '../../src/constants';

it('saves people array', () => {
  const peopleList = [ { id: '1' }, { id: '2' } ];

  const state = people(
    {},
    {
      type: REQUESTS.GET_PEOPLE_LIST.SUCCESS,
      results: {
        findAll: () => peopleList,
      },
    }
  );

  expect(state.all).toEqual(peopleList);
});

it('saves people by org array', () => {
  const orgs = [
    { people: [ { id: 1 } ] },
    { people: [ { id: 2 } ] },
  ];

  const state = people(
    {},
    {
      type: PEOPLE_WITH_ORG_SECTIONS,
      myOrgs: orgs,
    }
  );
  
  expect(state.allByOrg).toEqual(orgs);
});