import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@apollo/react-hooks';

import { GET_FEATURE_FLAGS } from '../../../actions/misc';
import { useFeatureFlags } from '../useFeatureFlags';

jest.mock('@apollo/react-hooks');

describe('useFeatureFlag', () => {
  it('returns booleans for flags', () => {
    const features = ['feature 1', 'feature 2'];

    (useQuery as jest.Mock).mockReturnValue({ data: { features } });

    const { result } = renderHook(() => useFeatureFlags());

    expect(useQuery).toHaveBeenCalledWith(GET_FEATURE_FLAGS, {
      fetchPolicy: 'cache-only',
    });

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "feature 1": true,
        "feature 2": true,
      }
    `);
  });
});
