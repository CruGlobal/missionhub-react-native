import React from 'react';

import { navigatePush } from '../../../../actions/navigation';
import { trackSearchFilter } from '../../../../actions/analytics';
import { buildTrackingObj } from '../../../../utils/common';
import SurveyQuestionsFilter from '../../SurveyQuestionsFilter';
import { SEARCH_REFINE_SCREEN } from '../../../SearchPeopleFilterRefineScreen';
import {
  testSnapshotShallow,
  renderShallow,
  createMockNavState,
} from '../../../../../testUtils';

jest.mock('../../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigate success' }),
}));
jest.mock('../../../../actions/analytics', () => ({
  trackSearchFilter: jest.fn().mockReturnValue({ type: 'track success' }),
}));
jest.mock('../../../../utils/common');

const options = [
  {
    id: '1',
    text: 'Question 1',
    options: [{ id: '1.1', text: '1.1' }, { id: '1.2', text: '1.2' }],
    preview: 'any',
  },
  {
    id: '2',
    text: 'Question 2',
    options: [{ id: '2.1', text: '2.1' }, { id: '2.2', text: '2.2' }],
    preview: 'any',
  },
  {
    id: '3',
    text: 'Question 3',
    options: [{ id: '3.1', text: '3.1' }, { id: '3.2', text: '3.2' }],
    preview: 'any',
  },
];

const nav = createMockNavState({
  onFilter: jest.fn(),
  options,
  filters: {},
});

it('renders correctly', () => {
  testSnapshotShallow(<SurveyQuestionsFilter navigation={nav} />);
});

describe('SurveyQuestionsFilter', () => {
  let component;
  let instance;

  beforeEach(() => {
    component = renderShallow(
      <SurveyQuestionsFilter
        navigation={nav}
        dispatch={jest.fn(() => jest.fn())}
      />,
    );
    instance = component.instance();
  });

  describe('handleDrillDown', () => {
    it('handles drilldown to answer options', () => {
      const item = options[0];

      instance.handleDrillDown(item);

      expect(navigatePush).toHaveBeenCalledWith(SEARCH_REFINE_SCREEN, {
        onFilter: instance.handleSelectFilter,
        title: instance.props.t('titleAnswers'),
        options: item.options,
        filters: instance.state.filters,
        trackingObj: buildTrackingObj(
          `search : refine : ${item.id}`,
          'search',
          'refine',
          item.id,
        ),
      });
      expect(trackSearchFilter).toHaveBeenCalledWith(item.id);
    });
  });

  describe('handleSelectFilter', () => {
    const selected = options[0];
    const item = selected.options[0];

    it('selects new filter', () => {
      instance.setState({ selectedFilterId: selected.id });

      const expectedNewOptions = [
        {
          ...options[0],
          preview: options[0].options[0].text,
        },
        {
          ...options[1],
        },
        {
          ...options[2],
        },
      ];
      const expectedNewFilter = {
        [selected.id]: { id: selected.id, text: item.text, isAnswer: true },
      };

      instance.handleSelectFilter(item);

      expect(instance.state).toEqual({
        filters: expectedNewFilter,
        options: expectedNewOptions,
        selectedFilterId: selected.id,
        refreshing: false,
      });
    });
  });
});
