import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GetFeatureFlags } from './__generated__/GetFeatureFlags';

export const GET_FEATURE_FLAGS = gql`
  query GetFeatureFlags {
    features
  }
`;

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
