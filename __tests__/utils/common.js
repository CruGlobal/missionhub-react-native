import { DrawerActions } from 'react-navigation';

import { isMissionhubUser, openMainMenu } from '../../src/utils/common';
jest.mock('react-navigation', () => ({
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));
import { MAIN_MENU_DRAWER } from '../../src/constants';

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
