import { GLOBAL_COMMUNITY_ID } from '../constants';

export function removeHiddenOrgs(orgs, { user: { hidden_organizations } }) {
  return hidden_organizations
    ? orgs.filter(org => !hidden_organizations.includes(org.id))
    : orgs;
}
