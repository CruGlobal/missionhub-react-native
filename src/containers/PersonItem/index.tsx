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
import { Flex, Text, Touchable, Icon, Card } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { hasOrgPermissions, orgIsCru } from '../../utils/common';
import ItemHeaderText from '../../components/ItemHeaderText';
import { SELECT_PERSON_STAGE_FLOW } from '../../routes/constants';

import styles from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

interface PersonItemProps {
  person: PersonAttributes;
  organization?: { [key: string]: any };
  me: PersonAttributes;
  stagesObj: any;
  onSelect: (person: PersonAttributes, org?: any) => void;
  dispatch: ThunkDispatch<any, null, never>;
}

const PersonItem = ({
  person,
  organization,
  me,
  stagesObj,
  onSelect,
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

  const handleSelect = () => onSelect(person, organization);

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

  return (
    <Card onPress={handleSelect} style={styles.card}>
      {renderStageIcon()}
      {renderNameAndStage()}
    </Card>
  );
};

const mapStateToProps = ({ auth, stages }: { auth: any; stages: any }) => ({
  me: auth.person,
  stagesObj: stages.stagesObj || {},
});

export default connect(mapStateToProps)(PersonItem);
