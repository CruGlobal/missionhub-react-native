import {
  PERSON_FIRST_NAME_CHANGED,
  PERSON_LAST_NAME_CHANGED,
  UPDATE_ONBOARDING_PERSON,
  RESET_ONBOARDING_PERSON,
  COMPLETE_ONBOARDING,
  LOGOUT,
} from '../constants';
import { REQUESTS } from '../api/routes';

export interface PersonProfileState {
  id: string | null;
  hasCompletedOnboarding: boolean;
  personFirstName: string;
  personLastName: string;
  contactAssignmentId: string | null;
}

const initialPersonProfileState: PersonProfileState = {
  id: null,
  hasCompletedOnboarding: false,
  personFirstName: '',
  personLastName: '',
  contactAssignmentId: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function personProfileReducer(state = initialPersonProfileState, action: any) {
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
    case LOGOUT:
      return initialPersonProfileState;
    default:
      return state;
  }
}

export default personProfileReducer;
