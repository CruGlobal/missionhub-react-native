import React, { ReactElement, Children } from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import { render } from 'react-native-testing-library';
import Enzyme, { shallow as enzymeShallow, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationComponent,
  NavigationParams,
} from 'react-navigation';

Enzyme.configure({ adapter: new Adapter() });

export const createThunkStore = configureStore([thunk]);

const TestNavigator = ({
  children,
  params,
}: {
  children: NavigationComponent;
  params?: NavigationParams;
}) => {
  const Navigator = createAppContainer(
    createSwitchNavigator({
      TestScreen: { screen: () => Children.only(children), params },
    }),
  );
  return <Navigator />;
};

interface RenderWithContextParams {
  initialState?: {} | undefined;
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
  return {
    ...render(
      <TestNavigator params={navParams}>
        <Provider store={store}>{component}</Provider>
      </TestNavigator>,
    ),
    store,
  };
}

export function snapshotWithContext(
  component: ReactElement,
  renderWithContextParams?: RenderWithContextParams,
) {
  const { toJSON } = renderWithContext(component, renderWithContextParams);
  expect(toJSON()).toMatchSnapshot();
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
