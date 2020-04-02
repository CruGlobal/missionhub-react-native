import i18next from 'i18next';

import { personSelector } from '../../selectors/people';
import { getStageIndex } from '../../utils/common';
import { AuthState } from '../../reducers/auth';
import { StagesState } from '../../reducers/stages';
import { StepsState } from '../../reducers/steps';
import { PeopleState, Person } from '../../reducers/people';

export function paramsForStageNavigation(
  personId: string,
  orgId: string | undefined,
  getState: () => {
    auth: AuthState;
    stages: StagesState;
    steps: StepsState;
    people: PeopleState;
  },
) {
  const {
    auth: { person: authPerson },
    stages: { stages, stagesObj },
    steps,
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
  const hasHitCount = hasHitThreeSteps(steps, personId);
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
}

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

function hasHitThreeSteps(steps: StepsState, personId: string) {
  return steps.userStepCount[personId] % 3 === 0;
}

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
