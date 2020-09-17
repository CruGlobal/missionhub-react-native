import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { PEOPLE_WITH_ORG_SECTIONS } from '../constants';
import { REQUESTS } from '../api/routes';
import { Person } from '../reducers/people';
import { getAuthPerson } from '../auth/authUtilities';
import { RootState } from '../reducers';

import callApi from './api';

export function getMyPeople() {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const peopleQuery = {
      filters: {
        assigned_tos: 'me',
      },
      page: {
        limit: 1000,
      },
      include:
        'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
    };

    const loadedPeople: Person[] = (
      await dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, peopleQuery))
    ).response;
    const authPerson = getAuthPerson();

    const people = [
      authPerson,
      ...loadedPeople
        .map(person => ({
          ...person,
          // Only store contact assignments that have a corresponding org permission
          reverse_contact_assignments: person.reverse_contact_assignments.filter(
            // @ts-ignore
            contactAssignment =>
              !contactAssignment.organization ||
              (person.organizational_permissions || []).some(
                // @ts-ignore
                orgPermission =>
                  orgPermission?.organization?.id ===
                  contactAssignment.organization?.id,
              ),
          ),
        }))
        .filter(person => {
          return person.reverse_contact_assignments.some(
            // @ts-ignore
            contactAssignment =>
              contactAssignment.assigned_to &&
              contactAssignment.assigned_to.id === authPerson.id,
          );
        }),
    ];

    return dispatch({ type: PEOPLE_WITH_ORG_SECTIONS, response: people });
  };
}
