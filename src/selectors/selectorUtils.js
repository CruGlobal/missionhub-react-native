export function removeHiddenOrgs(orgs, { user: { hidden_organizations } }) {
  const visibleOrgs = hidden_organizations
    ? orgs.filter(org => !hidden_organizations.includes(org.id))
    : orgs;

  return visibleOrgs;
}
