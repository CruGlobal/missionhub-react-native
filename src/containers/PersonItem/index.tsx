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
import { Text, Touchable, Icon, Card } from '../../components/common';
import { navToPersonScreen } from '../../actions/person';
import { navigatePush } from '../../actions/navigation';
import {
  hasOrgPermissions,
  orgIsCru,
  buildTrackingObj,
  getAnalyticsSubsection,
} from '../../utils/common';
import ItemHeaderText from '../../components/ItemHeaderText';
import {
  SELECT_PERSON_STAGE_FLOW,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../../routes/constants';

import styles from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

interface PersonItemProps {
  person: PersonAttributes;
  organization?: { [key: string]: any };
  me: PersonAttributes;
  stagesObj: any;
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
  const contactAssignments = (person as any).reverse_contact_assignments || [];
  const contactAssignment =
    contactAssignments.find(
      (a: any) => a.assigned_to && a.assigned_to.id === me.id,
    ) || {};

  const newPerson = isMe ? me : person;
  const personName = isMe ? t('me') : newPerson.full_name || '';

  const stage = isMe
    ? (me as any).stage
    : stagesObj[`${contactAssignment.pathway_stage_id}`];

  const isCruOrg = orgIsCru(organization);

  const orgPermissions = (person as any).organizational_permissions || [];
  const personOrgPermissions = orgPermissions.find(
    (orgPermission: any) => orgPermission.organization_id === orgId,
  );

  const status =
    isMe || !isCruOrg || hasOrgPermissions(personOrgPermissions)
      ? ''
      : personOrgPermissions
      ? personOrgPermissions.followup_status || ''
      : 'uncontacted';

  const isUncontacted = status === 'uncontacted';

  const handleSelect = () => {
    dispatch(
      navToPersonScreen(
        person,
        organization && !isPersonal ? organization : undefined,
      ),
    );
  };

  const handleChangeStage = () => {
    dispatch(
      navigatePush(SELECT_PERSON_STAGE_FLOW, {
        personId: person.id,
        section: 'people',
        subsection: 'person',
        orgId,
        selectedStageId: stage && stage.id - 1,
      }),
    );
  };

  const handleAddStep = () => {
    const subsection = getAnalyticsSubsection(person.id, me.id);
    const trackingParams = {
      trackingObj: buildTrackingObj(
        'people : person : steps : add',
        'people',
        'person',
        'steps',
      ),
    };

    if (isMe) {
      dispatch(
        navigatePush(ADD_MY_STEP_FLOW, {
          ...trackingParams,
          organization,
        }),
      );
    } else {
      dispatch(
        navigatePush(ADD_PERSON_STEP_FLOW, {
          ...trackingParams,
          contactName: person.first_name,
          contactId: person.id,
          organization,
          createStepTracking: buildTrackingObj(
            `people : ${subsection} : steps : create`,
            'people',
            subsection,
            'steps',
          ),
        }),
      );
    }
  };

  const renderStageIcon = () => {
    return stage ? (
      <Touchable style={styles.image} onPress={handleChangeStage}>
        {stage ? (
          <Image
            style={styles.image}
            resizeMode={'contain'}
            source={stageIcons[stage.id - 1]}
          />
        ) : null}
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
          <Touchable onPress={handleChangeStage}>
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
    const stepsCount = Math.round(Math.random());

    return (
      <Touchable
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
    <Card onPress={handleSelect} style={styles.card}>
      {renderStageIcon()}
      {renderNameAndStage()}
      {renderStepIcon()}
    </Card>
  );
};

const mapStateToProps = ({ auth, stages }: { auth: any; stages: any }) => ({
  me: auth.person,
  stagesObj: stages.stagesObj || {},
});

export default connect(mapStateToProps)(PersonItem);
