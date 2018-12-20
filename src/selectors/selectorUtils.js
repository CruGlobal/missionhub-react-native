export function removeHiddenOrgs(orgs, authUser) {
  const hidden_orgs = authUser.user.hidden_organizations || [];

  return hidden_orgs ? orgs.filter(org => !hidden_orgs.includes(org.id)) : orgs;
}
