import { DrawerActions } from 'react-navigation';

import {
  isMissionhubUser,
  openMainMenu,
  getIconName,
  shuffleArray,
  searchHandleToggle,
  searchSelectFilter,
  searchRemoveFilter,
  getFilterOptions,
} from '../../src/utils/common';
import { MAIN_MENU_DRAWER } from '../../src/constants';

jest.mock('react-navigation', () => ({
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));

describe('isMissionhubUser', () => {
  it('should return true for admins', () => {
    expect(isMissionhubUser({ permission_id: 1 })).toEqual(true);
  });
  it('should return true for users', () => {
    expect(isMissionhubUser({ permission_id: 4 })).toEqual(true);
  });
  it('should return false for contacts', () => {
    expect(isMissionhubUser({ permission_id: 2 })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    expect(isMissionhubUser()).toEqual(false);
  });
});

describe('openMainMenu', () => {
  it('should open main drawer navigator', () => {
    openMainMenu();
    expect(DrawerActions.openDrawer).toHaveBeenCalledWith({
      drawer: MAIN_MENU_DRAWER,
    });
  });
});

describe('getIconName', () => {
  it('should return steps icon', () => {
    const item = { type: 'accepted_challenge' };
    const result = getIconName(item.type);
    expect(result).toBe('stepsIcon');
  });
  it('should return journey icon', () => {
    const item = { type: 'pathway_progression_audit' };
    const result = getIconName(item.type);
    expect(result).toBe('journeyIcon');
  });
  it('should return survey icon', () => {
    const item = { type: 'answer_sheet' };
    const result = getIconName(item.type);
    expect(result).toBe('surveyIcon');
  });
  it('should return interaction icon', () => {
    const item = { type: 'interaction', interaction_type_id: 2 };
    const result = getIconName(item.type, item.interaction_type_id);
    expect(result).toBe('spiritualConversationIcon');
  });
  it('should return null', () => {
    const item = { type: 'something_else' };
    const result = getIconName(item.type);
    expect(result).toBe(null);
  });
});

describe('shuffleArray', () => {
  const inArray = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
  const expectedOutArray = ['Alpha', 'Delta', 'Bravo', 'Charlie'];

  Math.random = jest.fn().mockReturnValue(0.5);

  it('reorders array and calls random for each item', () => {
    expect(shuffleArray(inArray)).toEqual(expectedOutArray);
    expect(Math.random).toHaveBeenCalledTimes(inArray.length);
  });
});

describe('searchHandleToggle', () => {
  const setState = jest.fn();
  const setFilter = jest.fn();
  const scope = {
    state: {
      toggleOptions: [
        { id: 'option1', selected: false },
        { id: 'option2', selected: true },
      ],
      filters: { filter1: { id: 'filter1' } },
    },
    setState,
    setFilter,
  };
  const item = { id: 'option1', selected: false };

  it('toggles the selected option', () => {
    searchHandleToggle(scope, item);

    expect(setState).toHaveBeenCalledWith({
      toggleOptions: [
        { id: 'option1', selected: true },
        { id: 'option2', selected: true },
      ],
    });
    expect(setFilter).toHaveBeenCalledWith({
      filter1: { id: 'filter1' },
      option1: { id: 'option1', selected: true },
    });
  });
});

describe('searchSelectFilter', () => {
  const setState = jest.fn();
  const setFilter = jest.fn();
  const scope = {
    state: {
      options: [
        { id: 'gender', text: 'Gender' },
        { id: 'option2', text: 'Option 2' },
      ],
      filters: { gender: { id: 'gender' } },
      selectedFilterId: 'gender',
    },
    setState,
    setFilter,
  };

  it('sets the preview on the selected option', () => {
    const item = { id: 'gender', text: 'Male' };
    searchSelectFilter(scope, item);

    expect(setState).toHaveBeenCalledWith({
      options: [
        { id: 'gender', text: 'Gender', preview: 'Male' },
        { id: 'option2', text: 'Option 2' },
      ],
    });
    expect(setFilter).toHaveBeenCalledWith({
      gender: item,
    });
  });

  it('removes the preview on the selected option', () => {
    const item = { id: 'any' };
    searchSelectFilter(scope, item);

    expect(setState).toHaveBeenCalledWith({
      options: [
        { id: 'gender', text: 'Gender' },
        { id: 'option2', text: 'Option 2' },
      ],
    });
    expect(setFilter).toHaveBeenCalledWith({});
  });
});

describe('searchRemoveFilter', () => {
  const setState = jest.fn(function(a, b) {
    this.state = a;
    b();
  });
  const scope = {
    state: {
      filters: { gender: { id: 'gender' }, unassigned: { id: 'unassigned' } },
    },
    setState,
  };

  it('removes the filter', async () => {
    await searchRemoveFilter(scope, 'gender');

    expect(setState).toHaveBeenCalled();
    expect(scope.state).toEqual({
      filters: { unassigned: { id: 'unassigned' } },
    });
  });

  it('removes the filter and clears default results', async () => {
    await searchRemoveFilter(scope, 'gender', ['gender']);

    expect(setState).toHaveBeenCalled();
    expect(scope.state).toEqual({
      filters: { unassigned: { id: 'unassigned' } },
      defaultResults: [],
    });
  });
});

describe('getFilterOptions', () => {
  const t = jest.fn();

  it('sets the preview', () => {
    const filters = {
      questions: { text: 'test' },
      gender: { text: 'male' },
    };
    const results = getFilterOptions(t, filters);

    expect(results.questions.preview).toBe('test');
    expect(results.gender.preview).toBe('male');
    expect(results.time.preview).toBe(undefined);
  });

  it('sets the selected value', () => {
    const filters = {
      uncontacted: true,
      unassigned: true,
      archived: false,
    };
    const results = getFilterOptions(t, filters);

    expect(results.uncontacted.selected).toBe(true);
    expect(results.unassigned.selected).toBe(true);
    expect(results.archived.selected).toBe(false);
  });
});
