import { getStages } from './stages';
import { getStepsByFilter } from './steps';
import { getPersonJourneyDetails } from './person';

export function getJourney(personId, orgId) {
  return async(dispatch, getState) => {
    const { personId: myId } = getState().auth;

    const [ stagesObj, person, journeySteps ] = await Promise.all([
      getStagesObj(dispatch, getState),
      getJourneyPerson(dispatch, personId),
      getJourneySteps(dispatch, personId, orgId),
    ]);

    const journeyItems = [
      ...journeySteps,
      ...getJourneyInteractions(person, stagesObj, myId, orgId),
      ...orgId ? getJourneySurveys(person, orgId) : [],
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

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

async function getStagesObj(dispatch, getState) {
  if (!getState().stages.stagesObj) {
    await dispatch(getStages());
  }
  return getState().stages.stagesObj;
}

async function getJourneySteps(dispatch, personId, orgId) {
  const stepsFilter = {
    completed: true,
    receiver_ids: personId,
    organization_ids: orgId,
  };
  const { response: steps } = await dispatch(getStepsByFilter(stepsFilter));
  return steps
    .filter((step) => orgId || !step.organization || !step.organization.id) // for personal ministry, filter out all org steps
    .map((s) => ({
      ...s,
      type: 'step',
      date: s.completed_at,
    }));
}

async function getJourneyPerson(dispatch, personId) {
  const personQuery = {
    include: 'pathway_progression_audits,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
  };
  const { response: person } = await dispatch(getPersonJourneyDetails(personId, personQuery));
  return person;
}

function getJourneyInteractions(person, stagesObj, myId, orgId) {
  return [
    ...person.interactions.filter((interaction) => interaction.initiators && interaction.initiators.some((initiator) => initiator.id === myId)),
    ...person.pathway_progression_audits.filter((audit) => audit.assigned_to && audit.assigned_to.id === myId),
  ]
    .filter((interaction) => !orgId && !interaction.organization || interaction.organization && interaction.organization.id === orgId)
    .map((j) => {
      let type = 'interaction';
      if (j.new_pathway_stage && j.old_pathway_stage) {
        type = 'stage';
        const oldStage = stagesObj[j.old_pathway_stage.id];
        j.old_stage = oldStage && oldStage.name;
        const newStage = stagesObj[j.new_pathway_stage.id];
        j.new_stage = newStage && newStage.name;
        j.name = person.first_name;
      }
      return {
        ...j,
        type,
        text: j.comment || '',
        date: j.created_at,
      };
    });
}

function getJourneySurveys(person, orgId) {
  return person.answer_sheets
    .filter((answerSheet) => answerSheet.survey && answerSheet.survey.organization_id === orgId)
    .map((s) => ({
      ...s,
      type: 'survey',
      date: s.created_at,
    }));
}
