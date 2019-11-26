import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import i18next from 'i18next';

import { Button } from '../common';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../selectors/people';
import { navigateToStageScreen } from '../../actions/misc';
import { getStageIndex } from '../../utils/common';
import { PeopleState } from '../../reducers/people';
import { AuthState } from '../../reducers/auth';
import { StagesState, Stage } from '../../reducers/stages';
import { localizedStageSelector } from '../../selectors/stages';

import styles from './styles';

interface AssignStageButtonProps {
  person: object;
  organization: object;
  isMe: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contactAssignment: any;
  firstItemIndex: number;
  pathwayStage: Stage | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
}

const AssignStageButton = ({
  dispatch,
  isMe,
  person,
  contactAssignment = null,
  organization,
  firstItemIndex,
  pathwayStage,
}: AssignStageButtonProps) => {
  const { t } = useTranslation('contactHeader');
  const assignStage = () => {
    dispatch(
      navigateToStageScreen(
        isMe,
        person,
        contactAssignment,
        organization,
        firstItemIndex,
      ),
    );
  };
  return (
    <Button
      testID="AssignStageButton"
      type="transparent"
      onPress={assignStage}
      text={(pathwayStage
        ? localizedStageSelector(pathwayStage, i18next.language).name
        : t('selectStage')
      ).toUpperCase()}
      style={[
        styles.assignButton,
        pathwayStage ? styles.buttonWithStage : styles.buttonWithNoStage,
      ]}
      buttonTextStyle={styles.assignButtonText}
    />
  );
};

const mapStateToProps = (
  {
    people,
    auth,
    stages,
  }: { people: PeopleState; auth: AuthState; stages: StagesState },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { person = {}, organization = {} }: any,
) => {
  const personId = person.id;
  const orgId = organization.id;
  const authPerson = auth.person;
  const stagesList = stages.stages || [];
  if (authPerson.id === personId) {
    const myStageId = authPerson.user.pathway_stage_id;
    return {
      isMe: true,
      pathwayStage: stagesList.find(s => s.id === `${myStageId}`),
      firstItemIndex: getStageIndex(stagesList, myStageId),
    };
  }
  const loadedPerson =
    personSelector({ people }, { personId, orgId }) || person;
  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person: loadedPerson, orgId },
  );
  const personStageId = contactAssignment && contactAssignment.pathway_stage_id;
  return {
    isMe: false,
    pathwayStage:
      contactAssignment && stagesList.find(s => s.id === `${personStageId}`),
    firstItemIndex:
      contactAssignment && getStageIndex(stagesList, personStageId),
    contactAssignment,
  };
};
export default connect(mapStateToProps)(AssignStageButton);
