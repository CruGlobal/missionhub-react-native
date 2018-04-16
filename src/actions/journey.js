import { getStepsByFilter } from './steps';
import { getPersonJourneyDetails } from './person';
import { UPDATE_JOURNEY_ITEMS } from '../constants';

export function reloadJourney(personId, orgId) {
  return async(dispatch, getState) => {
    const org = getState().journey[orgId ? orgId : 'personal'];
    const personFeed = org && org[personId];
    // If personFeed has been loaded, we need to reload it. If it has not, wait for ContactJourney screen to lazy load it
    return personFeed && await dispatch(getJourney(personId, orgId));
  };
}

export function getJourney(personId, orgId) {
  return async(dispatch, getState) => {
    try {

      const { person: { id: myId } } = getState().auth;

      const [ person, journeySteps ] = await Promise.all([
        getJourneyPerson(dispatch, personId),
        getJourneySteps(dispatch, personId, orgId),
      ]);

      const journeyItems = [
        ...journeySteps,
        ...getJourneyInteractions(person, myId, orgId),
        ...orgId ? getJourneySurveys(person, orgId) : [],
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // Add this so we know where to show the bump action on comments
      // We only want to show it if it's one of the first couple of items, otherwise the user won't see it.
      const checkCommentOnFirstItems = 3;
      for (let i = 0; i < checkCommentOnFirstItems; i++) {
        if (journeyItems[ i ] && journeyItems[ i ].type === 'interaction') {
          journeyItems[ i ].isFirstInteraction = true;
          break;
        }
      }

      dispatch(updateJourney(personId, orgId, journeyItems));
      return journeyItems;
    }
    catch (e) {
      return [];
    }
  };
}

async function getJourneySteps(dispatch, personId, orgId) {
  const stepsFilter = {
    completed: true,
    receiver_ids: personId,
    organization_ids: orgId,
  };
  const include = 'challenge_suggestion.pathway_stage';
  const { response: steps } = await dispatch(getStepsByFilter(stepsFilter, include));
  return steps
    .filter((step) => orgId || !step.organization || !step.organization.id) // for personal ministry, filter out all org steps
    .map((s) => ({
      ...s,
      type: 'step',
      date: s.completed_at,
    }));
}

async function getJourneyPerson(dispatch, personId) {
  const { response: person } = await dispatch(getPersonJourneyDetails(personId));
  return person;
}

function getJourneyInteractions(person, myId, orgId) {
  return [
    ...person.interactions
      .filter((interaction) => interaction.initiators && interaction.initiators.some((initiator) => initiator.id === myId))
      .map((interaction) => ({
        ...interaction,
        type: 'interaction',
        text: interaction.comment || '',
        date: interaction.created_at,
      })),
    ...person.pathway_progression_audits
      .filter((audit) => audit.assigned_to && audit.assigned_to.id === myId || audit.person.id === myId)
      .map((audit) => ({
        ...audit,
        type: 'stage',
        personName: person.first_name,
        old_pathway_stage: {
          name: '',
          ...audit.old_pathway_stage,
        },
        new_pathway_stage: {
          name: '',
          ...audit.new_pathway_stage,
        },
        date: audit.created_at,
      })),
  ]
    .filter((interaction) => !orgId && !interaction.organization || interaction.organization && interaction.organization.id === orgId);
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

export function updateJourney(personId, orgId, journeyItems) {
  return {
    type: UPDATE_JOURNEY_ITEMS,
    personId,
    orgId,
    journeyItems,
  };
}
