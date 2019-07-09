import { renderHook } from 'react-hooks-testing-library';
import { BackHandler } from 'react-native';

import { useDisableBack } from '../useDisableBack';

jest.mock('react-native', () => ({
  BackHandler: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
}));

describe('useDisableBack', () => {
  it('should be true on first render and false after', () => {
    const { unmount } = renderHook(() => useDisableBack());
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );

    (BackHandler.addEventListener as jest.Mock).mockClear();

    unmount();
    expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
  });
});
