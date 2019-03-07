import 'react-native';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

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

export const testSnapshot = data => {
  expect(renderer.create(data)).toMatchSnapshot();
};

export const createThunkStore = configureStore([thunk]);

export const renderShallow = (component, store = createThunkStore()) => {
  let renderedComponent = shallow(component, { context: { store: store } });

  // If component has translation wrappers, dive deeper
  while (renderedComponent.is('Translate') || renderedComponent.is('I18n')) {
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
