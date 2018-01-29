import people from '../../src/reducers/people';
import { REQUESTS } from '../../src/actions/api';
import { PEOPLE_WITH_ORG_SECTIONS } from '../../src/constants';

it('saves people array', () => {
  const state = people(
    {},
    {
      type: REQUESTS.GET_PEOPLE_LIST.SUCCESS,
      results: {
        findAll: () => [ { id: '1' }, { id: '2' } ],
      },
    }
  );

  expect(state.all.length).toBe(2);
  expect(state.all[0].id).toBe('1');
});

it('saves people by org array', () => {
  const state = people(
    {},
    {
      type: PEOPLE_WITH_ORG_SECTIONS,
      sections: [
        { organization: { id: '1' }, people: [ { id: '1' } ] },
        { organization: { id: '2' }, people: [ { id: '1' }, { id: '1' } ] },
      ],
    }
  );
  
  expect(state.allByOrg.length).toBe(2);
  expect(state.allByOrg[0].organization.id).toBe('1');
  expect(state.allByOrg[0].people.length).toBe(1);
});