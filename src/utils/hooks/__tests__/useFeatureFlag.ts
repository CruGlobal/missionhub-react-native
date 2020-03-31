import { renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/react-hooks';

import { useFeatureFlags } from '../useFeatureFlags';

jest.mock('@apollo/react-hooks', () => ({
  useApolloClient: jest.fn(),
}));

describe('useFeatureFlag', () => {
  it('returns booleans for flags', () => {
    const features = ['feature 1', 'feature 2'];

    const client = {
      readQuery: jest.fn().mockReturnValue({ features }),
    };

    (useApolloClient as jest.Mock).mockReturnValue(client);

    const { result } = renderHook(() => useFeatureFlags());

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "feature 1": true,
        "feature 2": true,
      }
    `);
  });
});
