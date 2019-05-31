import { renderHook } from 'react-hooks-testing-library';

import { useIsMount } from '../useIsMount';

describe('useIsMount', () => {
  it('should be true on first render and false after', () => {
    const { result, rerender } = renderHook(() => useIsMount());
    expect(result.current).toEqual(true);
    rerender();
    expect(result.current).toEqual(false);
    rerender();
    expect(result.current).toEqual(false);
  });
});
