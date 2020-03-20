import { useApolloClient } from '@apollo/react-hooks';

import { GET_FEATURE_FLAGS } from '../../actions/misc';
import { GetFeatureFlags } from '../../actions/__generated__/GetFeatureFlags';

export const useFeatureFlags = (
  flagsToSearchFor: string[],
): { [key: string]: boolean } => {
  const client = useApolloClient();

  const { features } = client.readQuery<GetFeatureFlags>({
    query: GET_FEATURE_FLAGS,
  }) || { features: [] };

  return flagsToSearchFor.reduce(
    (acc, flag) => ({
      ...acc,
      [flag]: features.includes(flag),
    }),
    {},
  );
};
