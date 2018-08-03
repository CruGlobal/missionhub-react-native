export function removeHiddenOrgs(orgs, authUser) {
  const hidden_orgs = authUser.user.hidden_organizations;

  return hidden_orgs
    ? orgs.filter(
        org => !hidden_orgs.find(hidden_org_id => hidden_org_id === org.id),
      )
    : orgs;
}
