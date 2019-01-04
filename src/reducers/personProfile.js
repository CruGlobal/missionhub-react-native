import {
  PERSON_FIRST_NAME_CHANGED,
  PERSON_LAST_NAME_CHANGED,
  UPDATE_ONBOARDING_PERSON,
  RESET_ONBOARDING_PERSON,
  COMPLETE_ONBOARDING,
  LOGOUT,
  HAS_NOT_CREATED_STEP,
} from '../constants';
import { REQUESTS } from '../actions/api';

const initialPersonProfileState = {
  hasCompletedOnboarding: false,
  hasNotCreatedStep: false,
  personFirstName: '',
  personLastName: '',
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
        hasNotCreatedStep: state.hasNotCreatedStep,
        hasCompletedOnboarding: true,
      };
    case COMPLETE_ONBOARDING:
      return {
        ...state,
        hasCompletedOnboarding: true,
      };
    case HAS_NOT_CREATED_STEP:
      return {
        ...state,
        hasNotCreatedStep: true,
      };
    case REQUESTS.ADD_CHALLENGES.SUCCESS:
      return {
        ...state,
        hasNotCreatedStep: false,
      };
    case LOGOUT:
      return initialPersonProfileState;
    default:
      return state;
  }
}

export default personProfileReducer;
