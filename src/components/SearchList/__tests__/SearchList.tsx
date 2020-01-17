import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import Text from '../../Text';

import SearchList from '..';

it('renders search list', () => {
  testSnapshotShallow(
    <SearchList
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
        renderItem: ({ item }) => <Text>{item.text}</Text>,
      }}
      onSearch={onSearch}
      onRemoveFilter={jest.fn()}
      filters={{}}
      placeholder={'placeholder'}
    />,
  )
    .instance()
    // @ts-ignore
    .handleSearch('test');

  expect(onSearch).toHaveBeenCalled();
});

it('calls onFilterPress prop', () => {
  const onFilterPress = jest.fn();

  renderShallow(
    <SearchList
      // @ts-ignore
      onFilterPress={onFilterPress}
      listProps={{
        // @ts-ignore
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
    // @ts-ignore
    .handleFilter('test');

  expect(onFilterPress).toHaveBeenCalled();
});

it('calls clearSearch', () => {
  const component = renderShallow(
    <SearchList
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
  // @ts-ignore
  component.clearSearch();

  // @ts-ignore
  expect(component.state.text).toBe('');
});

it('calls removeFilter', () => {
  const onRemoveFilter = jest.fn(() => Promise.resolve());

  const component = renderShallow(
    <SearchList
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
  // @ts-ignore
  component.removeFilter('test');

  expect(onRemoveFilter).toHaveBeenCalled();
});

it('calls handleTextChange', () => {
  const component = renderShallow(
    <SearchList
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
  // @ts-ignore
  component.handleSearchDebounced = jest.fn();
  // @ts-ignore
  component.handleTextChange('test');

  // @ts-ignore
  expect(component.handleSearchDebounced).toHaveBeenCalled();
});

it('should call ref', () => {
  const instance = renderShallow(
    <SearchList
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
  // @ts-ignore
  instance.ref(ref);
  // @ts-ignore
  expect(instance.searchInput).toEqual(ref);
});

it('should call key extractor', () => {
  const instance = renderShallow(
    <SearchList
      // @ts-ignore
      onFilterPress={jest.fn()}
      listProps={{
        // @ts-ignore
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
  // @ts-ignore
  const result = instance.keyExtractor(item);
  expect(result).toEqual(item.id);
});
