import { UPDATE_JOURNEY_ITEMS } from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';

// @ts-ignore
export function reloadJourney(personId) {
  // @ts-ignore
  return (dispatch, getState) => {
    const org = getState().journey['personal'];
    const personFeed = org && org[personId];
    // If personFeed has been loaded, we need to reload it. If it has not, wait for ContactJourney screen to lazy load it
    return personFeed && dispatch(getJourney(personId));
  };
}

// @ts-ignore
export function getJourney(personId) {
  // @ts-ignore
  return async dispatch => {
    try {
      const {
        response: { all: personFeed },
        // @ts-ignore
      } = await dispatch(getPersonFeed(personId));

      // Add this so we know where to show the bump action on comments
      // We only want to show it if it's one of the first couple of items, otherwise the user won't see it.
      const checkCommentOnFirstItems = 3;
      for (let i = 0; i < checkCommentOnFirstItems; i++) {
        if (personFeed[i] && personFeed[i]._type === 'interaction') {
          personFeed[i].isFirstInteraction = true;
          break;
        }
      }

      dispatch(updateJourney(personId, personFeed));
      return personFeed;
    } catch (e) {
      return [];
    }
  };
}

// @ts-ignore
// eslint-disable-next-line max-params
function getPersonFeed(personId, orgId, include, filters = {}) {
  // @ts-ignore
  return dispatch => {
    const query = {
      include:
        include ||
        'all.challenge_suggestion.pathway_stage.localized_pathway_stages,all.old_pathway_stage.localized_pathway_stages,all.new_pathway_stage.localized_pathway_stages,all.answers.question,all.survey,all.person,all.assigned_to,all.assigned_by',
      filters: {
        person_id: personId,
        organization_ids: orgId || 'null',
        starting_at: '2011-01-01T00:00:00Z', // Hardcoded to get all history
        ending_at: new Date().toISOString(),
        ...filters,
      },
    };
    return dispatch(callApi(REQUESTS.GET_PERSON_FEED, query));
  };
}

// @ts-ignore
function updateJourney(personId, personFeed) {
  return {
    type: UPDATE_JOURNEY_ITEMS,
    personId,
    journeyItems: personFeed,
  };
}
