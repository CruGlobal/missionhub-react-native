import people from '../../src/reducers/people';
import { PEOPLE_WITH_ORG_SECTIONS } from '../../src/constants';

it('saves people by org array', () => {
  const orgs = [
    { people: [ { id: 1 } ] },
    { people: [ { id: 2 } ] },
  ];

  const state = people(
    {},
    {
      type: PEOPLE_WITH_ORG_SECTIONS,
      orgs: orgs,
    }
  );
  
  expect(state.allByOrg).toEqual(orgs);
});
