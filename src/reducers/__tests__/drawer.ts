import { DrawerActions } from 'react-navigation-drawer';

import drawer, { initialDrawerState } from '../drawer';
import { RELOAD_APP, LOGOUT } from '../../constants';

it('updates drawer to be open', () => {
  const state = drawer(undefined, {
    type: DrawerActions.OPEN_DRAWER,
  });
  expect(state).toEqual({
    isOpen: true,
  });
});

it('updates drawer to be closed', () => {
  const state = drawer(
    { isOpen: true },
    {
      type: DrawerActions.CLOSE_DRAWER,
    },
  );
  expect(state).toEqual({
    isOpen: false,
  });
});

it('resets drawer state to closed on reload app', () => {
  const state = drawer(
    { isOpen: true },
    {
      type: RELOAD_APP,
    },
  );
  expect(state).toEqual(initialDrawerState);
});

it('resets drawer state to closed on logout', () => {
  const state = drawer(
    { isOpen: true },
    {
      type: LOGOUT,
    },
  );
  expect(state).toEqual(initialDrawerState);
});
