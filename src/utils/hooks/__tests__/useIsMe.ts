import { flushMicrotasksQueue } from 'react-native-testing-library';

import { useMyId, useIsMe } from '../useIsMe';
import { renderHookWithContext } from '../../../../testUtils';

jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const myId = '10';

describe('useMyId', () => {
  it("should return the current user's person id", async () => {
    const { result } = renderHookWithContext(() => useMyId(), {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    });

    await flushMicrotasksQueue();

    expect(result.current).toEqual(myId);
  });
});

describe('useMyId', () => {
  it("should return true if the id matches the current user's person id", async () => {
    const { result } = renderHookWithContext(() => useIsMe(myId), {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    });

    await flushMicrotasksQueue();

    expect(result.current).toEqual(true);
  });

  it("should return false if the id does not match the current user's person id", () => {
    const { result } = renderHookWithContext(() => useIsMe('5'), {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    });
    expect(result.current).toEqual(false);
  });
});
