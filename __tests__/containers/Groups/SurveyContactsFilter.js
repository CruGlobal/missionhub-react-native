import React from 'react';

import SurveyContactsFilter from '../../../src/containers/Groups/SurveyContactsFilter';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../testUtils';
import { navigatePush } from '../../../src/actions/navigation';
import * as common from '../../../src/utils/common';

jest.mock('../../../src/actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../src/actions/surveys', () => ({
  getSurveyQuestions: jest.fn(() => ({
    type: 'surveyQuestions',
    response: [{ id: '1' }, { id: '2' }],
  })),
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
const survey = { id: '11' };

describe('SurveyContactsFilter', () => {
  const onFilter = jest.fn();
  const component = (
    <SurveyContactsFilter
      navigation={createMockNavState({
        onFilter,
        filters,
        survey,
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
    common.searchHandleToggle = jest.fn();
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    instance.handleToggle(item);
    expect(common.searchHandleToggle).toHaveBeenCalledWith(instance, item);
  });

  it('should handleSelectFilter correctly', () => {
    common.searchSelectFilter = jest.fn();
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    instance.handleSelectFilter(item);
    expect(common.searchSelectFilter).toHaveBeenCalledWith(instance, item);
  });
});
