import { useState, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRefreshing = (onRefreshAction: () => any) => {
  const [isRefreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefreshAction();
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshAction, setRefreshing]);

  return { isRefreshing, refresh };
};
