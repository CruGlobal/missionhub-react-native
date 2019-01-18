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
      { organizations },
      { orgId: orgTwo.id },
    );

    expect(result).toEqual(orgTwo);
  });

  it('should return an empty org when undefined is passed', () => {
    const result = organizationSelector(
      { organizations },
      { orgId: undefined },
    );

    expect(result).toEqual({});
  });
});

describe('allOrganizationsSelector', () => {
  const auth = { person: {} };

  it('should return all non-hidden orgs', () => {
    removeHiddenOrgs.mockReturnValue([orgTwo]);

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
    removeHiddenOrgs.mockReturnValue([orgOneWithCR, orgTwoWithCR]);

    const result = communitiesSelector({ organizations, auth });
    expect(result).toEqual([orgOneWithCR]);
    expect(removeHiddenOrgs).toHaveBeenCalledWith(
      organizations.all,
      auth.person,
    );
  });
});
