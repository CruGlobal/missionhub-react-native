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
      date: s.completed_at,
    }));

    // Get the interactions
    const personQuery = {
      // include: 'pathway_progression_audit,interactions.comment',
      include: 'pathway_progression_audit,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
    };
    const person = await dispatch(getUserDetails(personId, personQuery));
    journeyInteractions = findAllNonPlaceHolders(person, 'contact_assignment')
      .concat(findAllNonPlaceHolders(person, 'interaction'))
      .concat(findAllNonPlaceHolders(person, 'pathway_progression_audit'));

    journeyInteractions = journeyInteractions.map((j) => {
      let text = '';
      let type = 'interaction';
      let date = j.created_at;
      if (j.comment) {
        // type = 'comment';
        text = j.comment;
      }
      return {
        ...j,
        text,
        type,
        date,
      };
    });
    
    
    
    // TODO: Make a request to get the full surveys for {personId} if jean
    if (isJean && !personal) {
      journeySurveys = findAllNonPlaceHolders(person, 'answer_sheet').map((s) => {
        return {
          ...s,
          type: 'survey',
          date: s.created_at,
        };
      });
    }


    // Combine all and then update the store
    let journeyItems = [].concat(
      journeySteps,
      journeyInteractions,
      journeySurveys,
    );
    journeyItems.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      if (aDate > bDate) {
        return -1;
      } else if (aDate < bDate) {
        return 1;
      }
      return 0;
    });
    // TODO: Sort by created date

    return journeyItems;
  };
}