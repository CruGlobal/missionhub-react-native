import { REHYDRATE } from 'redux-persist/constants';
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED } from '../constants';
import { REQUESTS } from '../actions/api';

const initialPersonProfileState = {
  personFirstName: '',
  personLastName: '',
  noteId: null,
};

function personProfileReducer(state = initialPersonProfileState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.personProfile;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case PERSON_FIRST_NAME_CHANGED:
      return { ...state, personFirstName: action.personFirstName };
    case PERSON_LAST_NAME_CHANGED:
      return { ...state, personLastName: action.personLastName };
    case REQUESTS.ADD_NEW_PERSON.SUCCESS:
      const result = action.results.findAll('person')[0];
      return { ...state, id: result.id, personFirstName: result.first_name, personLastName: result.last_name };
    case REQUESTS.ADD_PERSON_NOTES.SUCCESS:
      console.log('success: ', action.results);
      return state;
    default:
      return state;
  }
}

export default personProfileReducer;