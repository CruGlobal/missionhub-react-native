import {
  PERSON_FIRST_NAME_CHANGED,
  PERSON_LAST_NAME_CHANGED,
  UPDATE_ONBOARDING_PERSON,
  RESET_ONBOARDING_PERSON,
  COMPLETE_ONBOARDING,
  LOGOUT,
  STASH_COMMUNITY_TO_JOIN,
} from '../constants';
import { REQUESTS } from '../actions/api';

const initialPersonProfileState = {
  hasCompletedOnboarding: false,
  personFirstName: '',
  personLastName: '',
  community: {},
};

function personProfileReducer(state = initialPersonProfileState, action) {
  switch (action.type) {
    case PERSON_FIRST_NAME_CHANGED:
      return {
        ...state,
        personFirstName: action.personFirstName,
      };
    case PERSON_LAST_NAME_CHANGED:
      return {
        ...state,
        personLastName: action.personLastName,
      };
    case REQUESTS.ADD_NEW_PERSON.SUCCESS:
    case UPDATE_ONBOARDING_PERSON:
      const person = action.results.response;
      const contactAssignment = person.reverse_contact_assignments[0];
      return {
        ...state,
        id: person.id,
        personFirstName: person.first_name,
        personLastName: person.last_name,
        contactAssignmentId: contactAssignment
          ? contactAssignment.id
          : state.contactAssignmentId,
      };
    case RESET_ONBOARDING_PERSON:
      return {
        ...initialPersonProfileState,
        hasCompletedOnboarding: true,
      };
    case COMPLETE_ONBOARDING:
      return {
        ...state,
        hasCompletedOnboarding: true,
      };
    case STASH_COMMUNITY_TO_JOIN:
      const { community } = action;
      return { ...state, community };
    case LOGOUT:
      return initialPersonProfileState;
    default:
      return state;
  }
}

export default personProfileReducer;
