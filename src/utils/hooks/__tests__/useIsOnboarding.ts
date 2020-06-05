import { useIsOnboarding } from '../useIsOnboarding';
import { renderHookWithContext } from '../../../../testUtils';

describe('useIsOnboarding', () => {
  it('should return true', () => {
    const { result } = renderHookWithContext(() => useIsOnboarding(), {
      initialState: { onboarding: { currentlyOnboarding: true } },
    });
    expect(result.current).toEqual(true);
  });

  it('should return true', () => {
    const { result } = renderHookWithContext(() => useIsOnboarding(), {
      initialState: { onboarding: { currentlyOnboarding: false } },
    });
    expect(result.current).toEqual(false);
  });
});
