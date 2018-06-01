import { DrawerActions } from 'react-navigation';

import {
  isMissionhubUser,
  openMainMenu,
  getIconName,
  shuffleArray,
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
