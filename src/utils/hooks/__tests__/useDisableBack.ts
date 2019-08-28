import { renderHook } from '@testing-library/react-hooks';
import { BackHandler } from 'react-native';

import { useDisableBack } from '../useDisableBack';

jest.mock('react-native', () => ({
  BackHandler: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
}));

beforeEach(() => {
  (BackHandler.addEventListener as jest.Mock).mockClear();
  (BackHandler.removeEventListener as jest.Mock).mockClear();
});

describe('useDisableBack', () => {
  it('should disable back button on mount and revert on unmount', () => {
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

  it('should not disable back on mount and not revert on unmount', () => {
    const { unmount } = renderHook(() => useDisableBack(true));
    expect(BackHandler.addEventListener).not.toHaveBeenCalled();

    (BackHandler.addEventListener as jest.Mock).mockClear();

    unmount();
    expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    expect(BackHandler.removeEventListener).not.toHaveBeenCalled();
  });

  it('should not disable back on mount and not revert when return value is called', () => {
    const { result } = renderHook(() => useDisableBack(true));
    expect(BackHandler.addEventListener).not.toHaveBeenCalled();

    (BackHandler.addEventListener as jest.Mock).mockClear();

    result.current();
    expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    expect(BackHandler.removeEventListener).not.toHaveBeenCalled();
  });
});
