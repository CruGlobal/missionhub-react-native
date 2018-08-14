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

it('renders text in search box', () => {
  const component = renderShallow(
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
  component.setState({ text: 'test' });

  expect(component).toMatchSnapshot();
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

it('calls clearSearch', () => {
  const component = renderShallow(
    <SearchList
      onFilterPress={jest.fn()}
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
  ).instance();
  component.clearSearch();

  expect(component.state.text).toBe('');
});

it('calls removeFilter', () => {
  const onRemoveFilter = jest.fn(() => Promise.resolve());

  const component = renderShallow(
    <SearchList
      onFilterPress={jest.fn()}
      listProps={{
        renderItem: ({ item }) => <Text>{item.text}</Text>,
      }}
      onSearch={jest.fn()}
      onRemoveFilter={onRemoveFilter}
      filters={{
        filter1: { id: '1', text: 'filter 1' },
      }}
      placeholder={'placeholder'}
    />,
  ).instance();
  component.removeFilter('test');

  expect(onRemoveFilter).toHaveBeenCalled();
});

it('calls handleTextChange', () => {
  const component = renderShallow(
    <SearchList
      onFilterPress={jest.fn()}
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
  ).instance();
  component.handleSearchDebounced = jest.fn();
  component.handleTextChange('test');

  expect(component.handleSearchDebounced).toHaveBeenCalled();
});

it('should call ref', () => {
  const instance = renderShallow(
    <SearchList
      onFilterPress={jest.fn()}
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
  ).instance();
  const ref = 'test';
  instance.ref(ref);
  expect(instance.searchInput).toEqual(ref);
});

it('should call key extractor', () => {
  const instance = renderShallow(
    <SearchList
      onFilterPress={jest.fn()}
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
  ).instance();
  const item = { id: '1' };
  const result = instance.keyExtractor(item);
  expect(result).toEqual(item.id);
});
