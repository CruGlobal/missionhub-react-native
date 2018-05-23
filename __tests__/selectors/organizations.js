import { organizationSelector } from '../../src/selectors/organizations';

const orgOne = { id: '95' };
const orgTwo = { id: '96' };

const organizations = {
  all: [orgOne, orgTwo],
};

it('should return org', () => {
  const result = organizationSelector({ organizations }, { orgId: orgTwo.id });

  expect(result).toEqual(orgTwo);
});

it('should not return an org when undefined is passed', () => {
  const result = organizationSelector({ organizations }, { orgId: undefined });

  expect(result).toBe(undefined);
});
