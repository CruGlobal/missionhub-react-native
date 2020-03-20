import { useApolloClient } from '@apollo/react-hooks';

import { useFeatureFlags } from '../useFeatureFlags';

jest.mock('react-navigation-hooks');
jest.mock('@apollo/react-hooks', () => ({
  useApolloClient: jest.fn(),
}));

const readQuery = jest.fn();

describe('useFeatureFlag', () => {
  it('returns booleans for flags', () => {
    const inputArray = ['feature_1', 'feature_2'];
    const queryArray = { features: ['feature_1'] };

    readQuery.mockReturnValue(queryArray);
    (useApolloClient as jest.Mock).mockReturnValue({ readQuery });

    const output = useFeatureFlags(inputArray);

    expect(output).toEqual({ ['feature_1']: true, ['feature_2']: false });
  });

  it('returns nothing if no inputs', () => {
    const inputArray: string[] = [];
    const queryArray = { features: ['feature_1'] };

    readQuery.mockReturnValue(queryArray);
    (useApolloClient as jest.Mock).mockReturnValue({ readQuery });

    const output = useFeatureFlags(inputArray);

    expect(output).toEqual({});
  });

  it('returns booleans for flags if query returns nothing', () => {
    const inputArray = ['feature_1', 'feature_2'];

    readQuery.mockReturnValue(null);
    (useApolloClient as jest.Mock).mockReturnValue({ readQuery });

    const output = useFeatureFlags(inputArray);

    expect(output).toEqual({ ['feature_1']: false, ['feature_2']: false });
  });
});
