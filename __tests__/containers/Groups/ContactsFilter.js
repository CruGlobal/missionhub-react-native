import React from 'react';

import ContactsFilter from '../../../src/containers/Groups/ContactsFilter';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../testUtils';
import { navigatePush } from '../../../src/actions/navigation';
import * as filterUtils from '../../../src/utils/filters';

jest.mock('../../../src/actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({});
const timeFilter30 = { id: 'time30', text: 'Last 30 days' };
const filters = {
  unassigned: {
    id: 'unassigned',
    selected: true,
    text: 'Unassigned',
  },
  time: timeFilter30,
};

describe('ContactsFilter', () => {
  const onFilter = jest.fn();
  const component = (
    <ContactsFilter
      navigation={createMockNavState({
        onFilter,
        filters,
      })}
    />
  );

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should handleDrillDown correctly', async () => {
    const instance = renderShallow(component, store).instance();
    const options = [{ id: 'o1' }, { id: 'o2' }];
    instance.handleDrillDown({ id: '1', options });

    expect(navigatePush).toHaveBeenCalled();
    expect(instance.state.selectedFilterId).toBe('1');
  });

  it('should handleToggle correctly', () => {
    filterUtils.searchHandleToggle = jest.fn();
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    instance.handleToggle(item);
    expect(filterUtils.searchHandleToggle).toHaveBeenCalledWith(instance, item);
  });

  it('should handleSelectFilter correctly', () => {
    filterUtils.searchSelectFilter = jest.fn();
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    instance.handleSelectFilter(item);
    expect(filterUtils.searchSelectFilter).toHaveBeenCalledWith(instance, item);
  });
});
