/* eslint complexity: 0 */
import React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import UNINTERESTED from '../../../assets/images/uninterestedIcon.png';
import CURIOUS from '../../../assets/images/curiousIcon.png';
import FORGIVEN from '../../../assets/images/forgivenIcon.png';
import GROWING from '../../../assets/images/growingIcon.png';
import GUIDING from '../../../assets/images/guidingIcon.png';
import NOTSURE from '../../../assets/images/notsureIcon.png';
import ItemHeaderText from '../../components/ItemHeaderText';
import { Text, Touchable, Icon, Card, Dot } from '../../components/common';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../actions/misc';
import { navToPersonScreen } from '../../actions/person';
import { hasOrgPermissions, orgIsCru } from '../../utils/common';
import { Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
import { StagesObj, StagesState } from '../../reducers/stages';
import { Person } from '../../reducers/people';
import { localizedStageSelector } from '../../selectors/stages';
import { GetPeopleStepsCount_communities_nodes_people_nodes as PersonStepCount } from '../../components/PeopleList/__generated__/GetPeopleStepsCount';
import { RootState } from '../../reducers';
import { contactAssignmentSelector } from '../../selectors/people';

import styles from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

interface PersonItemProps {
  person: PersonAttributes;
  organization?: Organization;
  me: Person;
  stagesObj: StagesObj;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  stepsData?: PersonStepCount;
}

const PersonItem = ({
  person,
  organization,
  me,
  stagesObj,
  dispatch,
  stepsData,
}: PersonItemProps) => {
  const { t } = useTranslation();
  const totalCount = stepsData ? stepsData.steps.pageInfo.totalCount : 0;
  const orgId = organization && organization.id;
  const isMe = person.id === me.id;
  const contactAssignment =
    useSelector(({ auth }: RootState) =>
      contactAssignmentSelector({ auth }, { person, orgId }),
    ) || {};

  const personName = isMe ? t('me') : person.full_name || '';

  const stage = isMe
    ? me.stage
    : stagesObj[`${contactAssignment.pathway_stage_id}`];

  const isCruOrg = orgIsCru(organization);

  const personOrgPermissions = (person.organizational_permissions || []).find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (orgPermission: any) => orgPermission.organization_id === orgId,
  );

  const status =
    isMe || !isCruOrg || hasOrgPermissions(personOrgPermissions)
      ? ''
      : personOrgPermissions
      ? personOrgPermissions.followup_status || ''
      : 'uncontacted';

  const handleSelect = () => dispatch(navToPersonScreen(person.id));

  const handleChangeStage = () =>
    dispatch(
      navigateToStageScreen(
        isMe,
        person,
        contactAssignment,
        organization,
        stage && stage.id - 1,
      ),
    );

  const handleAddStep = () =>
    stage
      ? dispatch(navigateToAddStepFlow(isMe, person, organization))
      : handleChangeStage();

  const renderStageIcon = () => {
    return (
      <View style={styles.stageIconWrapper}>
        {stage ? (
          <Image
            style={styles.image}
            resizeMode={'contain'}
            source={stageIcons[stage.id - 1]}
          />
        ) : null}
      </View>
    );
  };

  const renderNameAndStage = () => {
    return (
      <View style={styles.textWrapper}>
        <ItemHeaderText text={personName} />
        <View style={styles.textRow}>
          {stage ? (
            <Text style={styles.stage}>
              {localizedStageSelector(stage, i18next.language).name}
            </Text>
          ) : (
            <Touchable testID="stageText" onPress={handleChangeStage}>
              <Text style={[styles.stage, styles.addStage]}>
                {t('peopleScreen:addStage')}
              </Text>
            </Touchable>
          )}
          {status ? (
            <View style={styles.textRow}>
              <Dot style={styles.stage} />
              <Text style={[styles.stage]}>
                {t(`followupStatus.${status.toLowerCase()}`)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const renderStepIcon = () => {
    return totalCount > 0 ? (
      <View style={styles.stepButtonWrapper}>
        <Icon
          type="MissionHub"
          name="stepsIcon"
          size={30}
          style={styles.stepIcon}
        />
        <View style={styles.badge} testID="stepsCount">
          <Text style={styles.badgeText}>{totalCount}</Text>
        </View>
      </View>
    ) : (
      <Touchable
        testID="stepIcon"
        style={styles.stepButtonWrapper}
        onPress={handleAddStep}
      >
        <Icon
          type="MissionHub"
          name="stepsIcon"
          size={30}
          style={styles.stepIcon}
        />
        <Icon
          type="MissionHub"
          name="plusIcon"
          size={14}
          style={styles.stepPlusIcon}
        />
      </Touchable>
    );
  };

  return (
    <Card testID="personCard" onPress={handleSelect} style={styles.card}>
      {renderStageIcon()}
      {renderNameAndStage()}
      {renderStepIcon()}
    </Card>
  );
};

const mapStateToProps = ({
  auth,
  stages,
}: {
  auth: AuthState;
  stages: StagesState;
}) => ({
  me: auth.person,
  stagesObj: stages.stagesObj || {},
});

export default connect(mapStateToProps)(PersonItem);
