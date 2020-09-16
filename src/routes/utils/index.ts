import i18next from 'i18next';
import gql from 'graphql-tag';

import {
  personSelector,
  selectContactAssignment,
} from '../../selectors/people';
import { getStageIndex } from '../../utils/common';
import { apolloClient } from '../../apolloClient';
import { RootState } from '../../reducers';
import { getAuthPerson } from '../../auth/authUtilities';
import { AuthPerson_currentUser_person } from '../../auth/__generated__/AuthPerson';

import {
  StepCountWithPerson,
  StepCountWithPersonVariables,
} from './__generated__/StepCountWithPerson';

export const paramsForStageNavigation = async (
  personId: string,
  orgId: string,
  getState: () => RootState,
) => {
  const state = getState();

  const authPerson = getAuthPerson();
  const isMe = personId === authPerson?.id;
  const person = isMe ? authPerson : personSelector(state, { personId });
  const assignment = isMe
    ? null
    : selectContactAssignment(person, authPerson?.id);
  const stageId = getStageId(isMe, assignment, authPerson);
  const hasHitCount = await hasHitThreeSteps(personId);
  const isNotSure = hasNotSureStage(stageId);
  const firstItemIndex = getStageIndex(state.stages.stages, stageId);
  const firstName = isMe ? authPerson?.firstName : person.first_name;
  const questionText = getQuestionText(isMe, isNotSure, firstName);

  return {
    hasHitCount,
    isNotSure,
    firstItemIndex,
    questionText,
  };
};

function getStageId(
  isMe: boolean,
  assignment: { pathway_stage_id: string },
  authPerson?: AuthPerson_currentUser_person,
) {
  return isMe
    ? authPerson?.stage?.id
    : assignment && Number(assignment.pathway_stage_id) >= 0
    ? assignment.pathway_stage_id
    : undefined;
}

const STEP_COUNT_WITH_PERSON_QUERY = gql`
  query StepCountWithPerson($personId: ID!) {
    person(id: $personId) {
      id
      steps(completed: true) {
        pageInfo {
          totalCount
        }
      }
    }
  }
`;

const hasHitThreeSteps = async (personId: string) => {
  try {
    const { data } = await apolloClient.query<
      StepCountWithPerson,
      StepCountWithPersonVariables
    >({
      query: STEP_COUNT_WITH_PERSON_QUERY,
      variables: { personId },
    });
    return data.person.steps.pageInfo.totalCount % 3 === 0;
  } catch {
    return false;
  }
};

function hasNotSureStage(stageId?: string) {
  return stageId === '6';
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
