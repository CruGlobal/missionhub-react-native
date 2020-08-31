import { LOGOUT, UPDATE_JOURNEY_ITEMS, LogoutAction } from '../../constants';
import journeyReducer, { UpdateJourneyItemsAction } from '../journey';

const initialState = {
  personal: {},
};

const personId = '1';
const journeyItems = [{ id: 'one' }, { id: 'two' }];

describe('update journey items', () => {
  it('should add to personal', () => {
    const action = {
      type: UPDATE_JOURNEY_ITEMS,
      personId,
      journeyItems,
    } as UpdateJourneyItemsAction;

    const result = journeyReducer(undefined, action);

    expect(result).toEqual({
      personal: {
        [personId]: journeyItems,
      },
    });
  });
});

describe('logout', () => {
  it('should return initial state', () => {
    const action = { type: LOGOUT } as LogoutAction;

    const result = journeyReducer(undefined, action);

    expect(result).toEqual(initialState);
  });
});
