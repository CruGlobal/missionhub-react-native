import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';

import SearchPeopleScreenConnected, { SearchPeopleScreen } from '../../src/containers/SearchPeopleScreen';
import { testSnapshot, createMockStore } from '../../testUtils';

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
  expect(screen.dive().dive()).toMatchSnapshot();
});

it('renders with no results state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <SearchPeopleScreen />,
    { context: { store: store } }
  );

  screen.setState({ text: 'test' });
  expect(screen.dive().dive()).toMatchSnapshot();
});

it('renders with results state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <SearchPeopleScreen />,
    { context: { store: store } }
  );

  screen.setState({ results: [
    { id: '1', full_name: 'Ron Swanson', organization: { name: 'Cru at Harvard' } },
    { id: '2', full_name: 'Leslie Knope', organization: { name: 'Cru at Harvard' } },
    { id: '3', full_name: 'Ben Wyatt', organization: { name: 'Cru at Harvard' } },
  ] });
  expect(screen.dive().dive()).toMatchSnapshot();
});
   
describe('renders filtered with organization people', () => {
  let screen;

  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    screen = shallow(
      <SearchPeopleScreen dispatch={(r) => Promise.resolve(r)} />,
      { context: { store: store } }
    );
  });

  it('should combine organizations', () => {
    const mockOrg1 = { organization: { id: '100', name: 'Test Org' } };
    const mockOrg2 = { organization: { id: '101', name: 'Test Org' } };
    let mockPerson = {
      id: 1,
      organizational_permissions: [
        mockOrg1,
        mockOrg2,
      ],
    };
    const instance = screen.dive().dive().instance();
  
    const results = instance.getPeopleByOrg({
      findAll: () => [ mockPerson ],
    });
    expect(results).toEqual([
      {
        ...mockPerson,
        organization: mockOrg1.organization,
        unique_key: '100_1',
      },
      {
        ...mockPerson,
        organization: mockOrg2.organization,
        unique_key: '101_1',
      },
    ]);
  });

});
