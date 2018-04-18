import { REHYDRATE } from 'redux-persist/constants';
import nav from '../../src/reducers/nav';

describe('rehydrate', () => {
  it('returns navigation payload', () => {
    const navigation = {
      route: 'hello, world!',
    };

    const state = nav({},
      {
        type: REHYDRATE,
        payload: {
          navigation,
        },
      });

    expect(state).toEqual(navigation);
  });
});
