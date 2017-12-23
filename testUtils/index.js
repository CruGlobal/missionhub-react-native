import 'react-native';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { connect } from 'react-redux';

Enzyme.configure({ adapter: new Adapter() });

export const createMockStore = (state = {}) => {
  return {
    getState: jest.fn(() => (state)),
    dispatch: jest.fn(() => Promise.resolve()),
    subscribe: jest.fn(),
  };
};

export const createMockNavState = (params = {}) => {
  return { state: { params } };
};

export const testSnapshot = (data) => {
  expect(renderer.create(data)).toMatchSnapshot();
};

export const testSnapshotShallow = (component, store) => {
  let renderedComponent = shallow(
    component,
    { context: { store: store } }
  );

  // If component has translation wrappers, dive deeper
  while (renderedComponent.is('Translate') || renderedComponent.is('I18n')) {
    renderedComponent = renderedComponent.dive();
  }

  // Render contents of component
  expect(renderedComponent.dive()).toMatchSnapshot();
};
