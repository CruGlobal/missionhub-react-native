import React, { ReactElement } from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore, { MockStore } from 'redux-mock-store';
import { NavigationParams } from 'react-navigation';
import { NavigationProvider } from '@react-navigation/core';
import { ReactTestRendererJSON } from 'react-test-renderer';
import { render } from 'react-native-testing-library';
import snapshotDiff from 'snapshot-diff';
import Enzyme, { shallow as enzymeShallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { createNavigationProp } from './navigationHelpers';

Enzyme.configure({ adapter: new Adapter() });

export const createThunkStore = configureStore([thunk]);

interface RenderWithContextParams {
  initialState?: {};
  store?: MockStore;
  navParams?: NavigationParams;
}

// Inspiration from https://github.com/kentcdodds/react-testing-library/blob/52575005579307bcfbe7fbe4ef4636147c03c6fb/examples/__tests__/react-redux.js#L69-L80
export function renderWithContext(
  component: ReactElement,
  {
    initialState,
    store = createThunkStore(initialState),
    navParams,
  }: RenderWithContextParams = {},
) {
  const navigation = createNavigationProp(navParams);

  // Warning: don't call any functions in here that return new instances on every call. All the props need to stay the same otherwise rerender won't work.
  const wrapper = ({ children }: { children: ReactElement }) => (
    <NavigationProvider value={navigation}>
      <Provider store={store}>{children}</Provider>
    </NavigationProvider>
  );

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

// TODO: Remove all legacy rendering functions below

export const createMockNavState = (params = {}) => {
  return { state: { params } };
};

export const testSnapshot = (component: ReactElement) => {
  const { toJSON } = render(component);
  expect(toJSON()).toMatchSnapshot();
};

export const renderShallow = (
  component: ReactElement,
  store = createThunkStore(),
) => {
  let renderedComponent = enzymeShallow(
    <Provider store={store}>{component}</Provider>,
  ).dive();

  // If component has translation wrappers, dive deeper
  while (
    // @ts-ignore
    (renderedComponent.type().displayName || '').startsWith(
      'withI18nextTranslation(',
    )
  ) {
    renderedComponent = renderedComponent.dive();
  }

  // Render contents of component
  renderedComponent = renderedComponent.dive();
  return renderedComponent;
};

export const testSnapshotShallow = (
  component: ReactElement,
  store = createThunkStore(),
) => {
  const renderedComponent = renderShallow(component, store);
  expect(renderedComponent).toMatchSnapshot();
  return renderedComponent;
};
