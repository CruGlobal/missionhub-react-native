import React from 'react';

import SurveyContactsFilter from '../../SurveyContactsFilter';
import {
  createMockStore,
  renderShallow,
  createMockNavState,
} from '../../../../../testUtils';
import { navigatePush } from '../../../../actions/navigation';
import * as common from '../../../../utils/common';

jest.mock('../../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({});
const unassignedFilter = {
  id: 'unassigned',
  selected: true,
  text: 'Unassigned',
};
const timeFilter30 = { id: 'time30', text: 'Last 30 days' };
const timeFilter7 = { id: 'time7', text: 'Last 7 days' };
const questionId = '123';
const questionFilter = { id: questionId, answer: 'Yes', isAnswer: true };
const defaultFilters = {
  unassigned: unassignedFilter,
  time: timeFilter30,
};
const survey = { id: '11' };

describe('SurveyContactsFilter', () => {
  const onFilter = jest.fn();
  const createComponent = (filters = defaultFilters) => {
    return renderShallow(
      <SurveyContactsFilter
        navigation={createMockNavState({
          onFilter,
          filters,
          survey,
        })}
      />,
      store,
    );
  };

  it('should render correctly', () => {
    expect(createComponent()).toMatchSnapshot();
  });

  it('should setFilter correctly', () => {
    const instance = createComponent().instance();
    instance.setFilter({ time: timeFilter7 });
    expect(instance.state.filters.time).toMatchObject(timeFilter7);
    expect(onFilter).toHaveBeenCalled();
  });

  it('should handleDrillDown correctly', async () => {
    const instance = createComponent().instance();
    const options = [{ id: 'o1' }, { id: 'o2' }];
    instance.handleDrillDown({ id: '1', options });

    expect(navigatePush).toHaveBeenCalled();
    expect(instance.state.selectedFilterId).toBe('1');
  });

  it('should handleToggle correctly', () => {
    common.searchHandleToggle = jest.fn();
    const instance = createComponent().instance();
    const item = { id: 'test' };
    instance.handleToggle(item);
    expect(common.searchHandleToggle).toHaveBeenCalledWith(instance, item);
  });

  it('should handleSelectFilter correctly', () => {
    common.searchSelectFilter = jest.fn();
    const instance = createComponent().instance();
    const item = { id: 'test' };
    instance.handleSelectFilter(item);
    expect(common.searchSelectFilter).toHaveBeenCalledWith(instance, item);
  });

  describe('handleSelectQuestionFilters', () => {
    let item = {};
    let resultFilters = {};
    const startFilters = {
      ...defaultFilters,
      [questionId]: questionFilter,
    };

    it('should clear existing question filters', () => {
      resultFilters = defaultFilters;

      const instance = createComponent(startFilters).instance();
      instance.handleSelectQuestionFilters(item);
      expect(instance.state.filters).toEqual(resultFilters);
    });

    it('should update existing question filters', () => {
      item = { [questionId]: { ...questionFilter, text: 'No' } };
      resultFilters = {
        ...defaultFilters,
        ...item,
      };

      const instance = createComponent(startFilters).instance();
      instance.handleSelectQuestionFilters(item);
      expect(instance.state.filters).toEqual(resultFilters);
    });
  });
});
