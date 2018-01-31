// import callApi, { REQUESTS } from './api';
import { getStepsByFilter } from './steps';
import { getUserDetails } from './people';
import { findAllNonPlaceHolders } from '../utils/common';

export function getJourney(personId, personal = false) {
  return async(dispatch, getState) => {
    // const { personId: myId, isJean } = getState().auth.personId;
    const { isJean } = getState().auth;

    let journeySteps = [];
    let journeyInteractions = [];
    let journeySurveys = [];

    // Get the steps
    const stepsFilter = {
      completed: true,
      receiver_ids: personId,
    };
    const steps = await dispatch(getStepsByFilter(stepsFilter));
    journeySteps = findAllNonPlaceHolders(steps, 'accepted_challenge').map((s) => ({
      ...s,
      type: 'step',
    }));

    // Get the interactions
    const personQuery = {
      // include: 'pathway_progression_audits,surveys.name,interactions.comment,answer_sheets.surveys',
      include: 'pathway_progression_audits,interactions.comment',
    };
    const person = await dispatch(getUserDetails(personId, personQuery));
    journeyInteractions = findAllNonPlaceHolders(person, 'contact_assignment')
      .concat(findAllNonPlaceHolders(person, 'interaction'));

    journeyInteractions = journeyInteractions.map((j) => {
      let text = '';
      let type = 'interaction';
      if (j.comment) {
        // type = 'comment';
        text = j.comment;
      }
      return {
        ...j,
        text,
        type,
      };
    });

    // TODO: Make a request to get the full surveys for {personId} if jean
    if (isJean && !personal) {
      LOG('Need to get surveys for user');
    }


    // Combine all and then update the store
    let journeyItems = [].concat(
      journeySteps,
      journeyInteractions,
      journeySurveys,
    );
    // TODO: Sort by created date

    return journeyItems;
  };
}