import { getJourney } from '../../src/actions/journey';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let store;

beforeEach(() => store = configureStore([ thunk ])());



const steps = [ { id: 100 } ];
const people = [ { id: 1 } ];

const mockStepsResult = { findAll: () => steps };
const mockPeopleResult = { findAll: () => people };

const mockSteps = jest.fn(() => Promise.resolve(mockStepsResult));
jest.mock('../../src/actions/steps', () => ({
  getStepsByFilter: () => mockSteps,
}));
const mockPeople = jest.fn(() => Promise.resolve(mockPeopleResult));
jest.mock('../../src/actions/people', () => ({
  getUserDetails: () => mockPeople,
}));

describe('get journey', () => {

  it('should get persons journey', () => {
    store = configureStore([ thunk ])({
      auth: { isJean: false },
    });
    
    store.dispatch(getJourney(1)).then((finalResult) => {
      expect(finalResult).toBe([].concat(steps, people));
    });
  });

  it('should get persons personal journey', () => {
    store = configureStore([ thunk ])({
      auth: { isJean: false },
    });
    
    store.dispatch(getJourney(1, true)).then((finalResult) => {
      expect(finalResult).toBe([].concat(steps, people));
    });
  });
});
