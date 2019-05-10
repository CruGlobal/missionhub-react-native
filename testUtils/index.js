import React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

Enzyme.configure({ adapter: new Adapter() });

export const createMockNavState = (params = {}) => {
  return { state: { params } };
};

export const testSnapshot = data => {
  expect(renderer.create(data)).toMatchSnapshot();
};

export const createThunkStore = configureStore([thunk]);

export const renderShallow = (component, store = createThunkStore()) => {
  let renderedComponent = shallow(
    <Provider store={store}>{component}</Provider>,
  ).dive();

  // If component has translation wrappers, dive deeper
  while (
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

export const testSnapshotShallow = (component, store = createThunkStore()) => {
  const renderedComponent = renderShallow(component, store);
  expect(renderedComponent).toMatchSnapshot();
  return renderedComponent;
};
