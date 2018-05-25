import { DrawerActions } from 'react-navigation';

import drawer from '../../src/reducers/drawer';
import { LOGOUT } from '../../src/constants';

it('updates drawer to be open', () => {
  const state = drawer(undefined, {
    type: DrawerActions.OPEN_DRAWER,
  });
  expect(state.isOpen).toBe(true);
});

it('updates drawer to be closed', () => {
  const state = drawer(
    { isOpen: true },
    {
      type: DrawerActions.CLOSE_DRAWER,
    },
  );
  expect(state.isOpen).toBe(false);
});

it('resets drawer state to closed', () => {
  const state = drawer(
    { isOpen: true },
    {
      type: LOGOUT,
    },
  );
  expect(state.isOpen).toBe(false);
});
