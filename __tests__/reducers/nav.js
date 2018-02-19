import { REHYDRATE } from 'redux-persist/constants';
import nav from '../../src/reducers/nav';
import { MAIN_TABS } from '../../src/constants';

describe('rehydrate', () => {
  it('returns logged in state if user is logged in', () => {
    const state = nav({},
      {
        type: REHYDRATE,
        payload: {
          auth: {
            token: '2342342',
            isLoggedIn: true,
          },
        },
      });

    expect(state.routes[0].routeName).toEqual(MAIN_TABS);
    expect(state.routes.length).toEqual(1);
  });

  it('returns same state if user is not logged in', () => {
    const state = nav({},
      {
        type: REHYDRATE,
        payload: {
          auth: {
            token: null,
            isLoggedIn: true,
          },
        },
      });

    expect(state).toEqual({});
  });
});
