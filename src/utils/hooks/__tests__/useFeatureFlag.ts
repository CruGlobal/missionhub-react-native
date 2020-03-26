import { renderHook } from '@testing-library/react-hooks';
import { useLazyQuery } from '@apollo/react-hooks';

import { useFeatureFlags } from '../useFeatureFlags';

jest.mock('@apollo/react-hooks', () => ({
  useLazyQuery: jest.fn(),
}));

describe('useFeatureFlag', () => {
  it('returns booleans for flags', () => {
    const features = ['feature 1', 'feature 2'];
    (useLazyQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      { data: { features } },
    ]);

    const { result } = renderHook(() => useFeatureFlags());

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "feature 1": true,
        "feature 2": true,
      }
    `);
  });
});
