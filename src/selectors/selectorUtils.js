import { GLOBAL_COMMUNITY_ID } from '../constants';

export function removeHiddenOrgs(
  orgs,
  { user: { hidden_organizations, hide_global_community } },
) {
  const visibleOrgs = hidden_organizations
    ? orgs.filter(org => !hidden_organizations.includes(org.id))
    : orgs;

  return hide_global_community
    ? visibleOrgs.filter(org => org.id !== GLOBAL_COMMUNITY_ID)
    : visibleOrgs;
}
