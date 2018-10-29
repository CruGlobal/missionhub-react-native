import { removeHiddenOrgs } from '../selectorUtils';

const org1 = { id: '1' };
const org2 = { id: '2' };
const org3 = { id: '3' };

const orgs = [org1, org2, org3];

it('does nothing if user does not have any hidden orgs', () => {
  expect(removeHiddenOrgs(orgs, { user: {} })).toEqual([org1, org2, org3]);
});

it('removes hidden orgs', () => {
  expect(
    removeHiddenOrgs(orgs, {
      user: { hidden_organizations: [org1.id, org3.id] },
    }),
  ).toEqual([org2]);
});
