import { renderHook } from '@testing-library/react-hooks';

import { useInterval } from '../useInterval';

const callback = jest.fn();
const delay = 1000;

describe('useInterval', () => {
  it('sets interval', () => {
    jest.useFakeTimers();
    renderHook(() => useInterval(callback, delay));

    expect(callback).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('delays setting interval', () => {
    jest.useFakeTimers();
    const { rerender } = renderHook(
      (pause: boolean) => useInterval(callback, delay, pause),
      {
        initialProps: true,
      },
    );

    expect(callback).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(0);

    rerender(false);

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('clears interval on unmount', () => {
    jest.useFakeTimers();
    const { unmount } = renderHook(() => useInterval(callback, delay));

    expect(callback).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);

    unmount();

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});
