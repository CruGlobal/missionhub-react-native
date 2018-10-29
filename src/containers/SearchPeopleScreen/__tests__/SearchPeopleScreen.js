import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';

import SearchPeopleScreenConnected, { SearchPeopleScreen } from '..';

import {
  testSnapshot,
  createMockStore,
  renderShallow,
} from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';

const store = createMockStore();

jest.mock('react-native-device-info');
jest.mock('../../../actions/person');

const mockDispatch = r => Promise.resolve(r);

const people = [
  {
    id: '1',
    full_name: 'Ron Swanson',
    organization: { name: 'Cru at Harvard' },
  },
  {
    id: '2',
    full_name: 'Leslie Knope',
    organization: { name: 'Cru at Harvard' },
  },
  {
    id: '3',
    full_name: 'Ben Wyatt',
    organization: { name: 'Cru at Harvard' },
  },
];

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SearchPeopleScreenConnected />
    </Provider>,
  );
});

it('renders with searching state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(<SearchPeopleScreen />, { context: { store: store } });

  screen.setState({ isSearching: true });
  expect(screen.dive().dive()).toMatchSnapshot();
});

it('renders with no results state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(<SearchPeopleScreen />, { context: { store: store } });

  screen.setState({ text: 'test' });
  expect(screen.dive().dive()).toMatchSnapshot();
});

it('renders with results state', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(<SearchPeopleScreen />, { context: { store: store } });

  screen.setState({
    results: people,
  });
  expect(screen.dive().dive()).toMatchSnapshot();
});

describe('renders filtered with organization people', () => {
  let screen;

  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    screen = shallow(<SearchPeopleScreen dispatch={mockDispatch} />, {
      context: { store: store },
    });
  });

  it('should combine organizations', () => {
    const mockOrg1 = { organization: { id: '100', name: 'Test Org' } };
    const mockOrg2 = { organization: { id: '101', name: 'Test Org' } };
    const mockPerson = {
      id: 1,
      organizational_permissions: [mockOrg1, mockOrg2],
    };
    const instance = screen
      .dive()
      .dive()
      .instance();

    const results = instance.getPeopleByOrg({
      findAll: () => [mockPerson],
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

describe('calls methods', () => {
  let instance;

  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    instance = renderShallow(<SearchPeopleScreen dispatch={mockDispatch} />, {
      context: { store: store },
    }).instance();
  });

  it('calls list key extractor', () => {
    const item = { id: '1' };
    const result = instance.listKeyExtractor(item);
    expect(result).toEqual(item.id);
  });

  it('calls render item', () => {
    const renderedItem = instance.renderItem({
      item: {
        id: '1',
        full_name: 'Ron Swanson',
        organization: { name: 'Cru at Harvard' },
      },
    });
    expect(renderedItem).toMatchSnapshot();
  });

  it('should handleSelectPerson correctly', () => {
    const person = people[0];
    const org = person.organization;
    Enzyme.configure({ adapter: new Adapter() });
    const screen = renderShallow(
      <SearchPeopleScreen dispatch={mockDispatch} />,
      store,
    );

    screen.setState({
      results: people,
    });

    const listItem = screen
      .childAt(1)
      .props()
      .renderItem({ item: person });

    listItem.props.onSelect(person, org);

    expect(navToPersonScreen).toHaveBeenCalledWith(person, org);
  });
});
