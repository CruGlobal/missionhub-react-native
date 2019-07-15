import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import {
  testSnapshot,
  createThunkStore,
  renderShallow,
} from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';

import SearchPeopleScreenConnected, { SearchPeopleScreen } from '..';

const store = createThunkStore();

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
  const screen = renderShallow(<SearchPeopleScreen />, store);
  screen.setState({ isSearching: true });
  expect(screen).toMatchSnapshot();
});

it('renders with no results state', () => {
  const screen = renderShallow(<SearchPeopleScreen />, store);
  screen.setState({ text: 'test' });
  expect(screen).toMatchSnapshot();
});

it('renders with results state', () => {
  const screen = renderShallow(<SearchPeopleScreen />, store);
  screen.setState({ results: people });
  expect(screen).toMatchSnapshot();
});

describe('renders filtered with organization people', () => {
  let screen;

  beforeEach(() => {
    screen = renderShallow(
      <SearchPeopleScreen dispatch={mockDispatch} />,
      store,
    );
  });

  it('should combine organizations', () => {
    const mockOrg1 = { organization: { id: '100', name: 'Test Org' } };
    const mockOrg2 = { organization: { id: '101', name: 'Test Org' } };
    const mockPerson = {
      id: 1,
      organizational_permissions: [mockOrg1, mockOrg2],
    };
    const instance = screen.instance();

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
    instance = renderShallow(
      <SearchPeopleScreen dispatch={mockDispatch} />,
      store,
    ).instance();
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
