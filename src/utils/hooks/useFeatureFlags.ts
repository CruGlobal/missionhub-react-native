import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GetFeatureFlags } from '../../actions/__generated__/GetFeatureFlags';
import { GET_FEATURE_FLAGS } from '../../actions/misc';

export const useFeatureFlags = (): { [key: string]: boolean } => {
  const { data: { features = [] } = {} } = useQuery<GetFeatureFlags>(
    GET_FEATURE_FLAGS,
    {
      fetchPolicy: 'cache-only',
    },
  );

  return useMemo(
    () =>
      features.reduce(
        (acc, flag) => ({
          ...acc,
          [flag]: true,
        }),
        {},
      ),
    [features],
  );
};
