import { orgSelector } from '../../src/selectors/orgs';

const orgOne = { id: '95' };
const orgTwo = { id: '96' };

const organizations = {
  all: [ orgOne, orgTwo ],
};

it('should return org', () => {
  const result = orgSelector({ organizations }, { orgId: orgTwo.id });

  expect(result).toEqual(orgTwo);
});

it('should not return an org when undefined is passed', () => {
  const result = orgSelector({ organizations }, { orgId: undefined });

  expect(result).toBe(undefined);
});
