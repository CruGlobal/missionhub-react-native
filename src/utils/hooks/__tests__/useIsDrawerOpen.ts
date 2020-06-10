import { useIsDrawerOpen } from '../useIsDrawerOpen';
import { renderHookWithContext } from '../../../../testUtils';

describe('useIsDrawerOpen', () => {
  it('should return true', () => {
    const { result } = renderHookWithContext(() => useIsDrawerOpen(), {
      initialState: { drawer: { isOpen: true } },
    });
    expect(result.current).toEqual(true);
  });

  it('should return false', () => {
    const { result } = renderHookWithContext(() => useIsDrawerOpen(), {
      initialState: { drawer: { isOpen: false } },
    });
    expect(result.current).toEqual(false);
  });
});
