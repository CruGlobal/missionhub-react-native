import drawer from '../../src/reducers/drawer';
import {
  LOGOUT,
  DRAWER_OPEN,
  DRAWER_CLOSE,
} from '../../src/constants';

it('updates drawer to be open', () => {
  const state = drawer(undefined, {
    routeName: DRAWER_OPEN,
  });
  expect(state.isOpen).toBe(true);
});

it('updates drawer to be closed', () => {
  const state = drawer({ isOpen: true }, {
    routeName: DRAWER_CLOSE,
  });
  expect(state.isOpen).toBe(false);
});

it('resets drawer state to closed', () => {
  const state = drawer({ isOpen: true }, {
    type: LOGOUT,
  });
  expect(state.isOpen).toBe(false);
});
