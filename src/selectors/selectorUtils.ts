import { GLOBAL_COMMUNITY_ID } from '../constants';

export function removeHiddenOrgs(
  // @ts-ignore
  orgs,
  // @ts-ignore
  { user: { hidden_organizations, hide_global_community } },
) {
  const visibleOrgs = hidden_organizations
    ? // prettier-ignore
      // @ts-ignore
      orgs.filter(org => !hidden_organizations.includes(org.id))
    : orgs;

  return hide_global_community
    ? // prettier-ignore
      // @ts-ignore
      visibleOrgs.filter(org => org.id !== GLOBAL_COMMUNITY_ID)
    : visibleOrgs;
}
