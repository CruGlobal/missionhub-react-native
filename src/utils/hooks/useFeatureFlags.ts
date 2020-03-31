import { useMemo } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import { GetFeatureFlags } from '../../actions/__generated__/GetFeatureFlags';
import { GET_FEATURE_FLAGS } from '../../actions/misc';

export const useFeatureFlags = (): { [key: string]: boolean } => {
  const client = useApolloClient();

  let flags: { [key: string]: true } = {};

  const { features = [] } = client.readQuery<GetFeatureFlags>({
    query: GET_FEATURE_FLAGS,
  }) || { features: [] };

  useMemo(() => {
    flags = features.reduce(
      (acc, flag) => ({
        ...acc,
        [flag]: true,
      }),
      {},
    );
  }, []);

  return flags;
};
