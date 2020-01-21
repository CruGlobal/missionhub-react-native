import {
  organizationSelector,
  allOrganizationsSelector,
  communitiesSelector,
} from '../organizations';
import { removeHiddenOrgs } from '../selectorUtils';

jest.mock('../../selectors/selectorUtils');

const orgOne = { id: '95', community: true };
const orgTwo = { id: '96', community: false };
const orgThree = { id: '97', community: false };

const organizations = {
  all: [orgOne, orgTwo, orgThree],
};

describe('organizationSelector', () => {
  it('should return org', () => {
    const result = organizationSelector(
      // @ts-ignore
      { organizations },
      { orgId: orgTwo.id },
    );

    expect(result).toEqual(orgTwo);
  });

  it('should return an empty org when undefined is passed', () => {
    const result = organizationSelector(
      // @ts-ignore
      { organizations },
      { orgId: undefined },
    );

    expect(result).toEqual({});
  });

  it('should return only orgId when org not found', () => {
    const newOrgId = '98';

    // @ts-ignore
    const result = organizationSelector({ organizations }, { orgId: newOrgId });

    expect(result).toEqual({ id: newOrgId });
  });
});

describe('allOrganizationsSelector', () => {
  const auth = { person: {} };

  it('should return all non-hidden orgs', () => {
    // @ts-ignore
    removeHiddenOrgs.mockReturnValue([orgTwo]);

    // @ts-ignore
    const result = allOrganizationsSelector({ organizations, auth });

    expect(result).toEqual([orgTwo]);
    expect(removeHiddenOrgs).toHaveBeenCalledWith(
      organizations.all,
      auth.person,
    );
  });
});

describe('communitiesSelector', () => {
  const auth = { person: {} };

  it('should return all non-hidden orgs with community flag', () => {
    const orgOneWithCR = { ...orgOne, contactReport: {} };
    const orgTwoWithCR = { ...orgTwo, contactReport: {} };
    // @ts-ignore
    removeHiddenOrgs.mockReturnValue([orgOneWithCR, orgTwoWithCR]);

    // @ts-ignore
    const result = communitiesSelector({ organizations, auth });
    expect(result).toEqual([orgOneWithCR]);
    expect(removeHiddenOrgs).toHaveBeenCalledWith(
      organizations.all,
      auth.person,
    );
  });
});
