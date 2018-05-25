import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import SearchList from '../../src/components/SearchList';
import { Text } from '../../src/components/common';

it('renders search list', () => {
  testSnapshotShallow(
    <SearchList
      onFilterPress={jest.fn()}
      listProps={{
        renderItem: ({ item }) => <Text>{item.text}</Text>,
      }}
      onSearch={jest.fn()}
      onRemoveFilter={jest.fn()}
      filters={{}}
      placeholder={'placeholder'}
    />,
  );
});

it('renders filters', () => {
  testSnapshotShallow(
    <SearchList
      onFilterPress={jest.fn()}
      listProps={{
        renderItem: ({ item }) => <Text>{item.text}</Text>,
      }}
      onSearch={jest.fn()}
      onRemoveFilter={jest.fn()}
      filters={{
        filter1: { id: '1', text: 'filter 1' },
        filter2: { id: '2', text: 'filter 2' },
        filter3: { id: '3', text: 'filter 3' },
        filter4: { id: '4', text: 'filter 4' },
      }}
      placeholder={'placeholder'}
    />,
  );
});

it('calls onSearch prop', () => {
  const onSearch = jest.fn(() => Promise.resolve());

  renderShallow(
    <SearchList
      onFilterPress={jest.fn()}
      listProps={{
        renderItem: ({ item }) => <Text>{item.text}</Text>,
      }}
      onSearch={onSearch}
      onRemoveFilter={jest.fn()}
      filters={{}}
      placeholder={'placeholder'}
    />,
  )
    .instance()
    .handleSearch('test');

  expect(onSearch).toHaveBeenCalled();
});

it('calls onFilterPress prop', () => {
  const onFilterPress = jest.fn();

  renderShallow(
    <SearchList
      onFilterPress={onFilterPress}
      listProps={{
        renderItem: ({ item }) => <Text>{item.text}</Text>,
      }}
      onSearch={jest.fn()}
      onRemoveFilter={jest.fn()}
      filters={{
        filter1: { id: '1', text: 'filter 1' },
      }}
      placeholder={'placeholder'}
    />,
  )
    .instance()
    .handleFilter('test');

  expect(onFilterPress).toHaveBeenCalled();
});
