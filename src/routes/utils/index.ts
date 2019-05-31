import i18next from 'i18next';
import gql from 'graphql-tag';

import { apolloClient } from '../../apolloClient';
import { getAnalyticsSubsection, getStageIndex } from '../../utils/common';

import {
  PersonForStageSelection,
  PersonForStageSelectionVariables,
  PersonForStageSelection_person,
} from './__generated__/PersonForStageSelection';

const PERSON_FOR_STAGE_SELECTION_QUERY = gql`
  query PersonForStageSelection($id: ID!) {
    person(id: $id) {
      firstName
      reverseContactAssignments {
        id
        organization {
          id
        }
        assignedTo {
          id
        }
        pathwayStage {
          id
        }
      }
    }
  }
`;

export async function paramsForStageNavigation(
  personId: string,
  orgId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getState: () => any,
) {
  const {
    auth: { person: authPerson },
    stages: { stages, stagesObj },
    steps,
  } = getState();

  const isMe = personId === authPerson.id;
  const person = await loadPerson(personId);
  const assignment = isMe
    ? null
    : getReverseContactAssignment(person, orgId, authPerson);
  const stageId = isMe
    ? authPerson.user.pathway_stage_id
    : assignment && assignment.pathwayStage && assignment.pathwayStage.id;
  const hasHitCount = hasHitThreeSteps(steps, personId);
  const isNotSure = hasNotSureStage(stagesObj, stageId);
  const subsection = getAnalyticsSubsection(personId, authPerson.id);
  const firstItemIndex = getStageIndex(stages, stageId);
  const name: string = isMe
    ? authPerson.first_name
    : (person && person.firstName) || '';
  const questionText = getQuestionText(isMe, isNotSure, name);

  return {
    isMe,
    hasHitCount,
    isNotSure,
    subsection,
    firstItemIndex,
    questionText,
    contactAssignmentId: assignment && assignment.id,
    name,
  };
}

const loadPerson = async (personId: string) => {
  const {
    data: { person },
    errors,
  } = await apolloClient.query<
    PersonForStageSelection,
    PersonForStageSelectionVariables
  >({
    query: PERSON_FOR_STAGE_SELECTION_QUERY,
    variables: { id: personId },
  });
  if (errors) {
    return null; // If errors we just continue. The conditions in the parent flow will navigate to the celebration screen and skip stage selection.
  }
  return person;
};

function getReverseContactAssignment(
  person: PersonForStageSelection_person | null,
  orgId: string,
  authPerson: { id: string },
) {
  return (
    (person &&
      person.reverseContactAssignments &&
      person.reverseContactAssignments.find(
        assignment =>
          ((assignment.organization && assignment.organization.id === orgId) ||
            (!assignment.organization && (!orgId || orgId === 'personal'))) &&
          assignment.assignedTo.id === authPerson.id,
      )) ||
    null
  );
}

function hasHitThreeSteps(
  steps: { userStepCount: { [key: string]: number } },
  personId: string,
) {
  return steps.userStepCount[personId] % 3 === 0;
}

function hasNotSureStage(
  stagesObj: { [key: string]: { name_i18n: string } | undefined },
  stageId: string | null,
) {
  return stageId
    ? (stagesObj[stageId] || { name_i18n: '' }).name_i18n === 'notsure_name'
    : false;
}

function getQuestionText(isMe: boolean, isNotSure: boolean, name: string) {
  return isMe
    ? isNotSure
      ? i18next.t('selectStage:meQuestion', {
          name,
        })
      : i18next.t('selectStage:completed3StepsMe')
    : isNotSure
    ? i18next.t('selectStage:completed1Step', {
        name,
      })
    : i18next.t('selectStage:completed3Steps', {
        name,
      });
}
