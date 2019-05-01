import React, { useState, useEffect, useCallback } from 'react';

export const useRefreshing = (onRefreshAction: () => any) => {
  const [isRefreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefreshAction();
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { isRefreshing, refresh };
};
