import { REQUESTS } from '../../src/actions/api';
import groups from '../../src/reducers/groups';

it('loads my groups', () => {
  const newGroups = [
    { id: '4', name: 'Group 1' },
    { id: '5', name: 'Group 2' },
    { id: '6', name: 'Group 3' },
  ];
  const changedGroups = newGroups.map(g => ({
    text: g.name,
    ...g,
  }));

  newGroups.findAll = () => newGroups;

  const state = groups(
    {
      all: [],
    },
    {
      type: REQUESTS.GET_MY_GROUPS.SUCCESS,
      results: newGroups,
    },
  );

  expect(state.all).toEqual(changedGroups);
});
