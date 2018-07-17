import { UPDATE_JOURNEY_ITEMS } from '../constants';
import { isAdminForOrg } from '../utils/common';

import callApi, { REQUESTS } from './api';

export function reloadJourney(personId, orgId) {
  return async (dispatch, getState) => {
    const org = getState().journey[orgId ? orgId : 'personal'];
    const personFeed = org && org[personId];
    // If personFeed has been loaded, we need to reload it. If it has not, wait for ContactJourney screen to lazy load it
    return personFeed && (await dispatch(getJourney(personId, orgId)));
  };
}

export function getGroupJourney(personId, orgId) {
  return async (dispatch, getState) => {
    try {
      // Find out if I am an admin for this organization
      const me = getState().auth.person;
      const orgPermission = me.organizational_permissions.find(
        o => o.organization_id === orgId,
      );
      let isAdmin = isAdminForOrg(orgPermission);
      let include =
        'all.challenge_suggestion.pathway_stage,all.old_pathway_stage,all.new_pathway_stage,all.answers.question,all.survey,all.person,all.contact_assignment,all.contact_unassignment,all.assigned_to,all.assigned_by,all.contact_assignment.assigned_to,all.contact_assignment.person,all.receiver';
      // If I have admin permission, get me everything
      // Otherwise, just get me survey information
      if (!isAdmin) {
        include = 'all.answers.question,all.survey';
      }
      const {
        response: { all: feed },
      } = await dispatch(getPersonFeed(personId, orgId, include));

      return feed;
    } catch (e) {
      return [];
    }
  };
}

export function getJourney(personId, orgId) {
  return async dispatch => {
    try {
      const {
        response: { all: personFeed },
      } = await dispatch(getPersonFeed(personId, orgId));

      // Add this so we know where to show the bump action on comments
      // We only want to show it if it's one of the first couple of items, otherwise the user won't see it.
      const checkCommentOnFirstItems = 3;
      for (let i = 0; i < checkCommentOnFirstItems; i++) {
        if (personFeed[i] && personFeed[i]._type === 'interaction') {
          personFeed[i].isFirstInteraction = true;
          break;
        }
      }

      dispatch(updateJourney(personId, orgId, personFeed));
      return personFeed;
    } catch (e) {
      return [];
    }
  };
}

function getPersonFeed(personId, orgId, include) {
  return dispatch => {
    const query = {
      include:
        include ||
        'all.challenge_suggestion.pathway_stage,all.old_pathway_stage,all.new_pathway_stage,all.answers.question,all.survey,all.person,all.assigned_to,all.assigned_by',
      filters: {
        person_id: personId,
        organization_ids: orgId || 'null',
        starting_at: '2011-01-01T00:00:00Z', // Hardcoded to get all history
        ending_at: new Date().toISOString(),
      },
    };
    return dispatch(callApi(REQUESTS.GET_PERSON_FEED, query));
  };
}

export function updateJourney(personId, orgId, personFeed) {
  return {
    type: UPDATE_JOURNEY_ITEMS,
    personId,
    orgId,
    journeyItems: personFeed,
  };
}
