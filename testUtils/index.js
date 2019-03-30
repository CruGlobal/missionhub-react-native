import React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render, shallow } from 'react-native-testing-library';
import Enzyme, { shallow as enzymeShallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });

export const createMockStore = (state = {}) => {
  return {
    getState: jest.fn(() => state),
    dispatch: jest.fn(response => Promise.resolve(response)),
    subscribe: jest.fn(),
  };
};

export const createMockNavState = (params = {}) => {
  return { state: { params } };
};

export const snapshot = component => {
  const { toJSON } = render(component);
  expect(toJSON()).toMatchSnapshot();
};
export const testSnapshot = snapshot; // TODO: remove and rename existing usages

export const snapshotShallow = component => {
  const { output } = shallow(component);
  expect(output).toMatchSnapshot();
};

// Stolen from https://github.com/kentcdodds/react-testing-library/blob/52575005579307bcfbe7fbe4ef4636147c03c6fb/examples/__tests__/react-redux.js#L69-L80
export function renderWithRedux(
  ui,
  { initialState, store = configureStore([thunk])(initialState) } = {},
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}

export function snapshotWithRedux(ui, { initialState, store } = {}) {
  const { toJSON } = renderWithRedux(ui, { initialState, store });
  expect(toJSON()).toMatchSnapshot();
}

// TODO: stop using and remove
export const renderShallow = (component, store = configureStore([thunk])()) => {
  let renderedComponent = enzymeShallow(component, {
    context: { store: store },
  });

  // If component has translation wrappers, dive deeper
  while (renderedComponent.is('Translate') || renderedComponent.is('I18n')) {
    renderedComponent = renderedComponent.dive();
  }

  // Render contents of component
  renderedComponent = renderedComponent.dive();
  return renderedComponent;
};

// TODO: stop using and remove
export const testSnapshotShallow = (
  component,
  store = configureStore([thunk])(),
) => {
  const renderedComponent = renderShallow(component, store);
  expect(renderedComponent).toMatchSnapshot();
};
