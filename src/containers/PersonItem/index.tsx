/* eslint complexity: 0 */
import React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import UNINTERESTED from '../../../assets/images/uninterestedIcon.png';
import CURIOUS from '../../../assets/images/curiousIcon.png';
import FORGIVEN from '../../../assets/images/forgivenIcon.png';
import GROWING from '../../../assets/images/growingIcon.png';
import GUIDING from '../../../assets/images/guidingIcon.png';
import NOTSURE from '../../../assets/images/notsureIcon.png';
import ItemHeaderText from '../../components/ItemHeaderText';
import { Text, Touchable, Icon, Card } from '../../components/common';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../actions/misc';
import { navToPersonScreen } from '../../actions/person';
import { hasOrgPermissions, orgIsCru } from '../../utils/common';
import { Organization } from '../../reducers/organizations';
import { AuthPerson, AuthState } from '../../reducers/auth';
import { StagesObj, StagesState } from '../../reducers/stages';

import styles from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

interface PersonItemProps {
  person: PersonAttributes;
  organization?: Organization;
  me: AuthPerson;
  stagesObj: StagesObj;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
}

const PersonItem = ({
  person,
  organization,
  me,
  stagesObj,
  dispatch,
}: PersonItemProps) => {
  const { t } = useTranslation();
  const orgId = organization && organization.id;
  const isMe = person.id === me.id;
  const isPersonal = orgId === 'personal';
  const contactAssignment =
    (person.reverse_contact_assignments || []).find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any) => a.assigned_to && a.assigned_to.id === me.id,
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

  const isUncontacted = status === 'uncontacted';

  const handleSelect = () =>
    dispatch(
      navToPersonScreen(
        person,
        organization && !isPersonal ? organization : undefined,
      ),
    );

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
    dispatch(navigateToAddStepFlow(isMe, person, organization));

  const renderStageIcon = () => {
    return stage ? (
      <Touchable
        testID="stageIcon"
        style={styles.image}
        onPress={handleChangeStage}
      >
        <Image
          style={styles.image}
          resizeMode={'contain'}
          source={stageIcons[stage.id - 1]}
        />
      </Touchable>
    ) : (
      <View style={styles.image} />
    );
  };

  const renderNameAndStage = () => {
    return (
      <View style={styles.textWrapper}>
        <ItemHeaderText text={personName} />
        {
          <Touchable testID="stageText" onPress={handleChangeStage}>
            <Text style={[styles.stage, stage ? {} : styles.addStage]}>
              {stage ? stage.name : t('peopleScreen:addStage')}
            </Text>
          </Touchable>
        }
        {status ? (
          <Text
            style={[styles.stage, isUncontacted ? styles.uncontacted : null]}
          >
            {t(`followupStatus.${status.toLowerCase()}`)}
          </Text>
        ) : null}
      </View>
    );
  };

  const renderStepIcon = () => {
    //TODO: get count of steps for each contact
    const stepsCount = 0;

    return (
      <Touchable
        testID="stepIcon"
        style={{ alignItems: 'center', justifyContent: 'center' }}
        onPress={handleAddStep}
      >
        <Icon
          type="MissionHub"
          name="stepsIcon"
          size={30}
          style={styles.stepIcon}
        />
        {stepsCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{stepsCount}</Text>
          </View>
        ) : (
          <Icon
            type="MissionHub"
            name="plusIcon"
            size={14}
            style={styles.stepPlusIcon}
          />
        )}
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
