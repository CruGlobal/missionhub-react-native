import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UPDATE_JOURNEY_ITEMS } from '../constants';
import { REQUESTS } from '../api/routes';
import { RootState } from '../reducers';
import { JourneyItem, UpdateJourneyItemsAction } from '../reducers/journey';

import callApi from './api';

export function reloadJourney(personId: string) {
  return (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => RootState,
  ) => {
    const org = getState().journey.personal;
    const personFeed = org[personId];
    // If personFeed has been loaded, we need to reload it. If it has not, wait for ContactJourney screen to lazy load it
    return personFeed && dispatch(getJourney(personId));
  };
}

export function getJourney(personId: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    try {
      const {
        response: { all: personFeed },
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
      console.log('here');
      dispatch(updateJourney(personId, personFeed));
      console.log('here again');
      return personFeed;
    } catch (e) {
      return [];
    }
  };
}

function getPersonFeed(personId: string) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const query = {
      include:
        'all.challenge_suggestion.pathway_stage.localized_pathway_stages,all.old_pathway_stage.localized_pathway_stages,all.new_pathway_stage.localized_pathway_stages,all.answers.question,all.survey,all.person,all.assigned_to,all.assigned_by',
      filters: {
        person_id: personId,
        organization_ids: 'null',
        starting_at: '2011-01-01T00:00:00Z', // Hardcoded to get all history
        ending_at: new Date().toISOString(),
      },
    };
    return dispatch(callApi(REQUESTS.GET_PERSON_FEED, query));
  };
}

function updateJourney(personId: string, journeyItems: JourneyItem[]) {
  return {
    type: UPDATE_JOURNEY_ITEMS,
    personId,
    journeyItems,
  } as UpdateJourneyItemsAction;
}
