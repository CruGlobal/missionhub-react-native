import { LOGOUT, UPDATE_JOURNEY_ITEMS } from '../../src/constants';
import journeyReducer from '../../src/reducers/journey';

let initialState;

const personId = 1;
const orgId = 10;
const journeyItems = [ 'one', 'two' ];

beforeEach(() => initialState = {
  all: {
    'personal': {},
  },
});

it('should have personal ministry in initial state', () => {
  const result = journeyReducer(initialState, {});

  expect(result).toEqual({
    all: {
      'personal': {},
    },
  });
});

describe('update journey items', () => {
  it('should create org with given person if the former does not exist', () => {
    const action = { type: UPDATE_JOURNEY_ITEMS, personId, orgId, journeyItems };

    const result = journeyReducer(initialState, action);

    expect(result).toEqual({
      all: {
        'personal': {},
        [orgId]: {
          [personId]: journeyItems,
        },
      },
    });
  });

  it('should add to personal if no org is given', () => {
    const action = { type: UPDATE_JOURNEY_ITEMS, personId, journeyItems };

    const result = journeyReducer(initialState, action);

    expect(result).toEqual({
      all: {
        'personal': {
          [personId]: journeyItems,
        },
      },
    });
  });
});

describe('logout', () => {
  it('should return initial state', () => {
    const action = { type: LOGOUT };

    const result = journeyReducer(initialState, action);

    expect(result).toEqual(initialState);
  });
});
