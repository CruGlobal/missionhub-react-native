import { useRef, useEffect } from 'react';

export const useInterval = (
  callback: () => void,
  delay: number,
  pause = false,
) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }

    if (!pause) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay, pause]);
};
