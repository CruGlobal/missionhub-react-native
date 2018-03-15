import 'react-native';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Need to import for all translation screens to work properly
import '../src/i18n';

Enzyme.configure({ adapter: new Adapter() });

export const createMockStore = (state = {}) => {
  return {
    getState: jest.fn(() => (state)),
    dispatch: jest.fn((response) => Promise.resolve(response)),
    subscribe: jest.fn(),
  };
};

export const createMockNavState = (params = {}) => {
  return { state: { params } };
};

export const testSnapshot = (data) => {
  expect(renderer.create(data)).toMatchSnapshot();
};

export const renderShallow = (component, store) => {
  let renderedComponent = shallow(
    component,
    { context: { store: store } }
  );

  // If component has translation wrappers, dive deeper
  while (renderedComponent.is('Translate') || renderedComponent.is('I18n')) {
    renderedComponent = renderedComponent.dive();
  }

  // Render contents of component
  renderedComponent = renderedComponent.dive();
  return renderedComponent;
};

export const testSnapshotShallow = (component, store) => {
  const renderedComponent = renderShallow(component, store);
  expect(renderedComponent).toMatchSnapshot();
  return renderedComponent;
};

export const mockFnWithParams = (obj, method, expectedReturn, ...expectedParams) => {
  return obj[method] = jest.fn(
    (...actualParams) => {
      expect(actualParams).toEqual(expectedParams);
      return expectedReturn;
    }
  );
};
