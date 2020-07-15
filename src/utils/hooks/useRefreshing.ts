import { useState, useCallback } from 'react';

export const useRefreshing = (onRefreshAction: () => void) => {
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
