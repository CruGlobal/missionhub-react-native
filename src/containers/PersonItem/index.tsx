/* eslint-disable @typescript-eslint/no-explicit-any, complexity */

import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Touchable, Icon, Card } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { hasOrgPermissions, orgIsCru } from '../../utils/common';
import ItemHeaderText from '../../components/ItemHeaderText';
import { SELECT_PERSON_STAGE_FLOW } from '../../routes/constants';

import styles from './styles';

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

  const handleChangeStage = () => {
    dispatch(
      navigatePush(SELECT_PERSON_STAGE_FLOW, {
        personId: person.id,
        section: 'people',
        subsection: 'person',
        orgId,
      }),
    );
  };

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

  const renderNameAndStage = () => {
    return (
      <View style={styles.textWrapper}>
        <ItemHeaderText text={personName} />
        <Text style={styles.stage}>{stage ? stage.name : ''}</Text>
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
      {renderNameAndStage()}
    </Card>
  );
};

const mapStateToProps = ({ auth, stages }: { auth: any; stages: any }) => ({
  me: auth.person,
  stagesObj: stages.stagesObj || {},
});

export default connect(mapStateToProps)(PersonItem);
