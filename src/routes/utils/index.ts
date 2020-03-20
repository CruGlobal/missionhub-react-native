import i18next from 'i18next';
import gql from 'graphql-tag';

import { personSelector } from '../../selectors/people';
import { getStageIndex, getAnalyticsSubsection } from '../../utils/common';
import { apolloClient } from '../../apolloClient';
import { AuthState } from '../../reducers/auth';
import { StagesState } from '../../reducers/stages';
import { PeopleState, Person } from '../../reducers/people';

import {
  StepCountWithPerson,
  StepCountWithPersonVariables,
} from './__generated__/StepCountWithPerson';

export const paramsForStageNavigation = async (
  personId: string,
  orgId: string,
  getState: () => { auth: AuthState; stages: StagesState; people: PeopleState },
) => {
  const {
    auth: { person: authPerson },
    stages: { stages, stagesObj },
    people,
  } = getState();

  const isMe = personId === authPerson.id;
  const person = isMe
    ? authPerson
    : personSelector({ people }, { personId, orgId });
  const assignment = isMe
    ? null
    : getReverseContactAssignment(person, orgId, authPerson);
  const stageId = getStageId(isMe, assignment, authPerson);
  const hasHitCount = await hasHitThreeSteps(personId);
  const isNotSure = hasNotSureStage(stagesObj, stageId);
  const firstItemIndex = getStageIndex(stages, stageId);
  const firstName = isMe ? authPerson.first_name : person.first_name;
  const questionText = getQuestionText(isMe, isNotSure, firstName);

  return {
    hasHitCount,
    isNotSure,
    firstItemIndex,
    questionText,
  };
};

function getReverseContactAssignment(
  person: Person,
  orgId: string | undefined,
  authPerson: AuthState['person'],
) {
  return (
    ((person && person.reverse_contact_assignments) || []).find(
      // @ts-ignore
      a =>
        a &&
        ((a.organization && a.organization.id === orgId) ||
          (!a.organization && (!orgId || orgId === 'personal'))) &&
        a.assigned_to &&
        a.assigned_to.id === authPerson.id,
    ) || null
  );
}

function getStageId(
  isMe: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignment: any,
  authPerson: AuthState['person'],
) {
  return isMe
    ? authPerson.user.pathway_stage_id
    : assignment && assignment.pathway_stage_id >= 0
    ? assignment.pathway_stage_id
    : null;
}

const STEP_COUNT_WITH_PERSON_QUERY = gql`
  query StepCountWithPerson($personId: ID!) {
    person(id: $personId) {
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

function hasNotSureStage(stagesObj: StagesState['stagesObj'], stageId: string) {
  return ((stagesObj && stagesObj[stageId]) || {}).name_i18n === 'notsure_name';
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
