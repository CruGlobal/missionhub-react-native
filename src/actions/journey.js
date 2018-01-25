// import callApi, { REQUESTS } from './api';
import { SET_JOURNEY_ITEMS, CLEAR_JOURNEY_ITEMS } from '../constants';
import { getStepsByFilter } from './steps';
import { getUserDetails } from './people';
import { findAllNonPlaceHolders } from '../utils/common';

export function getJourney(personId) {
  return async(dispatch, getState) => {
    const { personId: myId, isJean } = getState().auth.personId;

    LOG('myId', myId, isJean);

    let journeySteps = [];
    let journeyInteractions = [];
    // let journeySteps = [];
    // let journeySteps = [];
    // let journeySteps = [];


    // Get the steps
    const stepsFilter = {
      completed: true,
      receiver_ids: personId,
    };
    const steps = await dispatch(getStepsByFilter(stepsFilter));
    LOG('steps', steps);
    journeySteps = findAllNonPlaceHolders(steps, 'steps').map((s) => ({
      ...s,
      type: 'step',
    }));


    // Get the interactions
    const peopleQuery = {
      include: 'surveys.name,interactions.comment,answer_sheets,surveys.title',
    };
    const interactions = await dispatch(getUserDetails(personId, peopleQuery));
    journeyInteractions = findAllNonPlaceHolders(interactions, 'interactions').map((s) => ({
      ...s,
      // TODO: Set the correct type for each of these
      type: 'interaction',
    }));

    // Combine all and then update the store
    let journeyItems = [].concat(
      journeySteps,
      journeyInteractions,
    );
    // TODO: Sort by created date

    return dispatch({ type: SET_JOURNEY_ITEMS, items: journeyItems });
  };
}

export function clearJourney() {
  return { type: CLEAR_JOURNEY_ITEMS };
}

