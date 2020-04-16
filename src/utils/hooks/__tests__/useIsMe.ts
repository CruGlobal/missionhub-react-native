import { useMyId, useIsMe } from '../useIsMe';
import { renderHookWithContext } from '../../../../testUtils';

const initialState = { auth: { person: { id: '2' } } };

describe('useMyId', () => {
  it("should return the current user's person id", () => {
    const { result } = renderHookWithContext(() => useMyId(), {
      initialState,
    });
    expect(result.current).toEqual('2');
  });
});

describe('useMyId', () => {
  it("should return true if the id matches the current user's person id", () => {
    const { result } = renderHookWithContext(() => useIsMe('2'), {
      initialState,
    });
    expect(result.current).toEqual(true);
  });

  it("should return true if the id matches the current user's person id", () => {
    const { result } = renderHookWithContext(() => useIsMe('1'), {
      initialState,
    });
    expect(result.current).toEqual(false);
  });
});
