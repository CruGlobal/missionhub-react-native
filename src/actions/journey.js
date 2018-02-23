// import callApi, { REQUESTS } from './api';
import { getStepsByFilter } from './steps';
import { getUserDetails } from './people';
import { getStages } from './stages';
import { findAllNonPlaceHolders } from '../utils/common';

export function getJourney(personId, personal = false, organization) {
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
      include: 'pathway_progression_audits,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
    };
    const person = await dispatch(getUserDetails(personId, personQuery));
    journeyInteractions = findAllNonPlaceHolders(person, 'contact_assignment')
      .concat(findAllNonPlaceHolders(person, 'interaction'))
      .concat(findAllNonPlaceHolders(person, 'pathway_progression_audit'));

    let stagesObj = getState().stages.stagesObj;

    if (!stagesObj) {
      await dispatch(getStages());
      stagesObj = getState().stages.stagesObj;
    }
      

    journeyInteractions = journeyInteractions.map((j) => {
      let text = '';
      let type = 'interaction';
      let date = j.created_at;
      if (j.comment) {
        // type = 'comment';
        text = j.comment;
      }
      if (j.new_pathway_stage && j.old_pathway_stage) {
        type = 'stage';
        const oldStage = stagesObj[`${j.old_pathway_stage.id}`];
        j.old_stage = oldStage && oldStage.name;
        const newStage = stagesObj[`${j.new_pathway_stage.id}`];
        j.new_stage = newStage && newStage.name;
        j.name = j.person ? j.person.first_name : '';
      }
      return {
        ...j,
        text,
        type,
        date,
      };
    });
    
    

    // For no organizations, filter out any interactions that have an organization id

    // For interactions, filter out by organization

    // For interactions, filter out by initiators array

    
    if (isJean && !personal) {
      journeySurveys = findAllNonPlaceHolders(person, 'answer_sheet')
        .filter((s) => organization && s.survey && s.survey.organization_id && `${organization.id}` === `${s.survey.organization_id}`)
        .map((s) => ({
          ...s,
          type: 'survey',
          date: s.created_at,
        }));
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

    // Add this so we know where to show the bump action on comments
    // We only want to show it if it's one of the first couple of items, otherwise the user won't see it.
    const checkCommentOnFirstItems = 3;
    for (let i = 0; i < checkCommentOnFirstItems; i++) {
      if (journeyItems[i] && journeyItems[i].type === 'interaction') {
        journeyItems[i].isFirstInteraction = true;
        break;
      }
    }

    return journeyItems;
  };
}