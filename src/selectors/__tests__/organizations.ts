import { organizationSelector } from '../organizations';
import { RootState } from '../../reducers';

jest.mock('../../selectors/selectorUtils');

const orgOne = { id: '95', community: true };
const orgTwo = { id: '96', community: false };
const orgThree = { id: '97', community: false };

const organizations = {
  all: [orgOne, orgTwo, orgThree],
};

describe('organizationSelector', () => {
  it('should return org', () => {
    const result = organizationSelector({ organizations } as RootState, {
      orgId: orgTwo.id,
    });

    expect(result).toEqual(orgTwo);
  });

  it('should return an empty org when undefined is passed', () => {
    const result = organizationSelector(
      { organizations } as RootState,
      // @ts-ignore
      { orgId: undefined },
    );

    expect(result).toEqual({});
  });

  it('should return only orgId when org not found', () => {
    const newOrgId = '98';

    const result = organizationSelector({ organizations } as RootState, {
      orgId: newOrgId,
    });

    expect(result).toEqual({ id: newOrgId });
  });
});
