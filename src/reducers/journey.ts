import { LOGOUT, UPDATE_JOURNEY_ITEMS, LogoutAction } from '../constants';

export interface JourneyItem {
  id: string;
}

export interface JourneyState {
  personal: { [key: string]: JourneyItem[] };
}

const initialState: JourneyState = {
  personal: {},
};

export interface UpdateJourneyItemsAction {
  type: typeof UPDATE_JOURNEY_ITEMS;
  personId: string;
  journeyItems: JourneyItem[];
}

function journeyReducer(
  state = initialState,
  action: UpdateJourneyItemsAction | LogoutAction,
) {
  switch (action.type) {
    case UPDATE_JOURNEY_ITEMS: {
      return {
        ...state,
        personal: {
          ...state.personal,
          [action.personId]: action.journeyItems,
        },
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default journeyReducer;
