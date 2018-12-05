import { removeHiddenOrgs } from '../selectorUtils';
import { GLOBAL_COMMUNITY_ID } from '../../constants';

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

it('hides global org', () => {
  expect(
    removeHiddenOrgs([{ id: GLOBAL_COMMUNITY_ID }, ...orgs], {
      user: {
        hidden_organizations: [org1.id, org3.id],
        hide_global_community: true,
      },
    }),
  ).toEqual([org2]);
});
