import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';

import { createMockStore } from '../../testUtils/index';
import SearchPeopleScreenConnected, { SearchPeopleScreen } from '../../src/containers/SearchPeopleScreen';
import { testSnapshot } from '../../testUtils';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SearchPeopleScreenConnected />
    </Provider>
  );
});

it('renders with searching state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <SearchPeopleScreen />,
    { context: { store: store } }
  );

  screen.setState({ isSearching: true });
  expect(screen.dive()).toMatchSnapshot();
});

it('renders with no results state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <SearchPeopleScreen />,
    { context: { store: store } }
  );

  screen.setState({ text: 'test' });
  expect(screen.dive()).toMatchSnapshot();
});

it('renders with results state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <SearchPeopleScreen />,
    { context: { store: store } }
  );

  screen.setState({ results: [
    { id: '1', full_name: 'Ron Swanson', organization: 'Cru at Harvard' },
    { id: '2', full_name: 'Leslie Knope', organization: 'Cru at Harvard' },
    { id: '3', full_name: 'Ben Wyatt', organization: 'Cru at Harvard' },
  ] });
  expect(screen.dive()).toMatchSnapshot();  
});
