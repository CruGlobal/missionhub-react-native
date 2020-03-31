import { useApolloClient } from '@apollo/react-hooks';

import { GetFeatureFlags } from '../../actions/__generated__/GetFeatureFlags';
import { GET_FEATURE_FLAGS } from '../../actions/misc';

export const useFeatureFlags = (): { [key: string]: boolean } => {
  const client = useApolloClient();

  const { features = [] } = client.readQuery<GetFeatureFlags>({
    query: GET_FEATURE_FLAGS,
  }) || { features: [] };

  return features.reduce(
    (acc, flag) => ({
      ...acc,
      [flag]: true,
    }),
    {},
  );
};
