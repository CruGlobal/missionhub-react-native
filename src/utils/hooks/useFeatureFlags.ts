import { useApolloClient } from '@apollo/react-hooks';

import { GET_FEATURE_FLAGS } from '../../actions/misc';
import { GetFeatureFlags } from '../../actions/__generated__/GetFeatureFlags';

export const useFeatureFlags = () => {
  const client = useApolloClient();

  const flags = client.readQuery<GetFeatureFlags>({
    query: GET_FEATURE_FLAGS,
  });
};
