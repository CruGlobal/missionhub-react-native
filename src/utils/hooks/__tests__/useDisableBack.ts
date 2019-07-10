import { renderHook } from 'react-hooks-testing-library';
import { BackHandler } from 'react-native';

import { useDisableBack } from '../useDisableBack';

jest.mock('react-native', () => ({
  BackHandler: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
}));

describe('useDisableBack', () => {
  it('should disable back button on mount and revert on unmount', () => {
    const { unmount, result } = renderHook(() => useDisableBack());
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
  it('should disable back button on mount and revert when return value is called', () => {
    const { result } = renderHook(() => useDisableBack());
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );

    (BackHandler.addEventListener as jest.Mock).mockClear();

    result.current();
    expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
  });
});
