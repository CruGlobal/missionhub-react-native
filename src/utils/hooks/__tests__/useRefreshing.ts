import { renderHook, act } from 'react-hooks-testing-library';

import { useRefreshing } from '../useRefreshing';

describe('useRefreshing', () => {
  test.each<[string, () => void | Promise<void>]>([
    ["doesn't return a promise", jest.fn()],
    ['returns a resolved promise', jest.fn(() => Promise.resolve())],
    ['returns a rejected promise', jest.fn(() => Promise.reject())],
  ])(
    'should update isRefreshing correctly when refresh is called and onRefreshAction %s',
    async (name, mockAction) => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useRefreshing(mockAction),
      );
      expect(result.current.isRefreshing).toEqual(false);
      act(() => {
        result.current.refresh();
      });
      expect(result.current.isRefreshing).toEqual(true);
      await waitForNextUpdate();
      expect(result.current.isRefreshing).toEqual(false);
    },
  );
});
