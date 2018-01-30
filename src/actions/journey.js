// import callApi, { REQUESTS } from './api';
import { getStepsByFilter } from './steps';
import { getUserDetails } from './people';
import { findAllNonPlaceHolders } from '../utils/common';

export function getJourney(personId, personal = false) {
  return async(dispatch, getState) => {
    // const { personId: myId, isJean } = getState().auth.personId;
    const { isJean } = getState().auth.personId;

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
    journeySteps = findAllNonPlaceHolders(steps, 'accepted_challenge').map((s) => ({
      ...s,
      type: 'step',
    }));

    // Get the interactions
    let peopleQuery = {};
    if (isJean && !personal) {
      peopleQuery = {
        include: 'pathway_progression_audits,surveys.name,interactions.comment,answer_sheets.surveys',
      };
    } else {
      // For Casey and jean's personal ministry, show the same things
      peopleQuery = {
        include: 'pathway_progression_audits,interactions.comment',
      };
    }
    const person = await dispatch(getUserDetails(personId, peopleQuery));
    journeyInteractions = (findAllNonPlaceHolders(person, 'answer_sheet'))
      .concat(findAllNonPlaceHolders(person, 'accepted_challenge'))
      .concat(findAllNonPlaceHolders(person, 'reverse_contact_assignment'))
      .concat(findAllNonPlaceHolders(person, 'interaction'))
      .concat(findAllNonPlaceHolders(person, 'comments'))
      .concat(findAllNonPlaceHolders(person, 'answer_sheet'));

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

    // TODO: Make a request to get the full surveys

    // Combine all and then update the store
    let journeyItems = [].concat(
      journeySteps,
      journeyInteractions,
    );
    // TODO: Sort by created date

    return journeyItems;
  };
}
