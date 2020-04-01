import { ReactNode } from 'react';
import 'react-native';
import { renderHook } from '@testing-library/react-hooks';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';

import { createApolloMockClient } from '../../../../testUtils/apolloMockClient';
import { GET_FEATURE_FLAGS } from '../../../actions/misc';
import { useFeatureFlags } from '../useFeatureFlags';

describe('useFeatureFlag', () => {
  it('returns booleans for flags', () => {
    const mockApolloClient = createApolloMockClient({});

    const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
      <ApolloProvider client={mockApolloClient}>{children}</ApolloProvider>
    );

    const { result } = renderHook(() => useFeatureFlags(), {
      wrapper,
    });

    expect(useQuery).toHaveBeenCalledWith(GET_FEATURE_FLAGS, {
      fetchPolicy: 'cache-only',
    });

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "feature 1": true,
        "feature 2": true,
      }
    `);
  });
});
