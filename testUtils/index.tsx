import React, { ReactElement, ReactNode } from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import { Provider as ProviderLegacy } from 'react-redux-legacy';
import thunk from 'redux-thunk';
import configureStore, { MockStore } from 'redux-mock-store';
import { NavigationParams, NavigationProvider } from 'react-navigation';
import { ApolloProvider } from '@apollo/react-hooks';
import { ReactTestRendererJSON } from 'react-test-renderer';
import { render } from 'react-native-testing-library';
import { renderHook } from '@testing-library/react-hooks';
import snapshotDiff from 'snapshot-diff';
import { IMocks } from 'graphql-tools';

import { createApolloMockClient } from './apolloMockClient';
import { createNavigationProp } from './navigationHelpers';

export const createThunkStore = configureStore([thunk]);

interface ContextParams {
  initialState?: Record<string, unknown>;
  store?: MockStore;
  navParams?: NavigationParams;
  mocks?: IMocks;
  initialApolloState?: unknown;
  noWrappers?: boolean;
}

const createTestContext = ({
  initialState,
  store = createThunkStore(initialState),
  navParams,
  mocks,
  initialApolloState,
  noWrappers = false,
}: ContextParams = {}) => {
  if (noWrappers) {
    return { wrapper: undefined, store };
  } else {
    const mockApolloClient = createApolloMockClient(mocks, initialApolloState);

    const navigation = createNavigationProp(navParams);

    // Warning: don't call any functions in here that return new instances on every call. All the props need to stay the same otherwise rerender won't work.
    return {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <NavigationProvider value={navigation}>
          <ProviderLegacy store={store}>
            <Provider store={store}>
              <ApolloProvider client={mockApolloClient}>
                {children}
              </ApolloProvider>
            </Provider>
          </ProviderLegacy>
        </NavigationProvider>
      ),
      store,
      navigation,
    };
  }
};

// Inspiration from https://github.com/kentcdodds/react-testing-library/blob/52575005579307bcfbe7fbe4ef4636147c03c6fb/examples/__tests__/react-redux.js#L69-L80
export function renderWithContext(
  component: ReactElement,
  contextParams: ContextParams = {},
) {
  const { wrapper, store, navigation } = createTestContext(contextParams);

  const renderResult = render(React.cloneElement(component, { navigation }), {
    wrapper,
  });

  let storedSnapshot: ReactTestRendererJSON | null;
  return {
    ...renderResult,
    store,
    snapshot: () => expect(renderResult.toJSON()).toMatchSnapshot(),
    recordSnapshot: () => (storedSnapshot = renderResult.toJSON()),
    diffSnapshot: () => {
      if (!storedSnapshot) {
        throw new Error(
          'You must call recordSnapshot to store an initial snapshot before calling diffSnapshot',
        );
      }
      expect(
        snapshotDiff(storedSnapshot, renderResult.toJSON()),
      ).toMatchSnapshot();
    },
  };
}

export const renderHookWithContext = <P, R>(
  callback: (props: P) => R,
  { initialProps, ...contextParams }: { initialProps?: P } & ContextParams = {},
) => {
  const { wrapper, store } = createTestContext(contextParams);
  return {
    ...renderHook(callback, {
      initialProps,
      wrapper,
    }),
    store,
  };
};
