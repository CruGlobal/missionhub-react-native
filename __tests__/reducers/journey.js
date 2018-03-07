import { LOGOUT, UPDATE_JOURNEY_ITEMS } from '../../src/constants';
import journeyReducer from '../../src/reducers/journey';

const initialState = {
  'personal': {},
};

const personId = 1;
const orgId = 10;
const journeyItems = [ 'one', 'two' ];

it('should have personal ministry in initial state', () => {
  const result = journeyReducer(undefined, {});

  expect(result).toEqual({
    'personal': {},
  });
});

describe('update journey items', () => {
  it('should create org with given person if the former does not exist', () => {
    const action = { type: UPDATE_JOURNEY_ITEMS, personId, orgId, journeyItems };

    const result = journeyReducer(undefined, action);

    expect(result).toEqual({
      'personal': {},
      [orgId]: {
        [personId]: journeyItems,
      },
    });
  });

  it('should add to personal if no org is given', () => {
    const action = { type: UPDATE_JOURNEY_ITEMS, personId, journeyItems };

    const result = journeyReducer(undefined, action);

    expect(result).toEqual({
      'personal': {
        [personId]: journeyItems,
      },
    });
  });

  it('should add to existing org if found', () => {
    const state = {
      'personal': {},
      [orgId]: {
        2: [ 'three', 'four' ],
      },
    };
    const action = { type: UPDATE_JOURNEY_ITEMS, personId, orgId, journeyItems };

    const result = journeyReducer(state, action);

    expect(result).toEqual({
      'personal': {},
      [orgId]: {
        [personId]: journeyItems,
        ...state[orgId],
      },
    });
  });
});

describe('logout', () => {
  it('should return initial state', () => {
    const action = { type: LOGOUT };

    const result = journeyReducer(undefined, action);

    expect(result).toEqual(initialState);
  });
});
