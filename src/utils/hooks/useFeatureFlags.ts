import { useMemo } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GetFeatureFlags } from './__generated__/GetFeatureFlags';

export const GET_FEATURE_FLAGS = gql`
  query GetFeatureFlags {
    features
  }
`;

export const useFeatureFlags = (): { [key: string]: boolean } => {
  const [getFlags, { data: { features = [] } = {} }] = useLazyQuery<
    GetFeatureFlags
  >(GET_FEATURE_FLAGS, {
    fetchPolicy: 'cache-and-network',
  });

  useMemo(() => {
    getFlags();
  }, []);

  return features.reduce(
    (acc, flag) => ({
      ...acc,
      [flag]: true,
    }),
    {},
  );
};
