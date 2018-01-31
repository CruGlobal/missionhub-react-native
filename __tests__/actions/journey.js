import { getJourney } from '../../src/actions/journey';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let store;

beforeEach(() => store = configureStore([ thunk ])());

describe('get journey', () => {
  const result = [ { id: 100 } ];
  const result2 = [ { id: 1 } ];

  it('should get persons journey', () => {
    store = configureStore([ thunk ])({
      auth: { isJean: false },
    });
    
    store.dispatch(getJourney(1)).then((finalResult) => {
      expect(finalResult).toBe([].concat(result, result2));
    });
  });

  it('should get persons personal journey', () => {
    store = configureStore([ thunk ])({
      auth: { isJean: false },
    });
    
    store.dispatch(getJourney(1, true)).then((finalResult) => {
      expect(finalResult).toBe([].concat(result, result2));
    });
  });
});
