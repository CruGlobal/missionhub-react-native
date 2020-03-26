import { useQuery } from '@apollo/react-hooks';

import { GET_FEATURE_FLAGS } from '../../actions/misc';
import { GetFeatureFlags } from '../../actions/__generated__/GetFeatureFlags';

export const useFeatureFlags = (): { [key: string]: boolean } => {
  const { data: { features = [] } = {} } = useQuery<GetFeatureFlags>(
    GET_FEATURE_FLAGS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  return features.reduce(
    (acc, flag) => ({
      ...acc,
      [flag]: true,
    }),
    {},
  );
};
