/* eslint-disable @typescript-eslint/no-explicit-any, complexity */

import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { getMyPeople } from '../../actions/people';
import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';
import { hasOrgPermissions, orgIsCru } from '../../utils/common';
import ItemHeaderText from '../../components/ItemHeaderText';

import styles from './styles';

interface PersonItemProps {
  person: PersonAttributes;
  organization: any;
  me: PersonAttributes;
  stagesObj: any;
  onSelect: (person: PersonAttributes, org: any) => void;
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
  const isMe = person.id === me.id;
  const isPersonal = organization && organization.id === 'personal';
  const contactAssignments = (person as any).reverse_contact_assignments || [];
  const contactAssignment =
    contactAssignments.find(
      (a: any) => a.assigned_to && a.assigned_to.id === me.id,
    ) || {};

  const handleSelect = () => onSelect(person, organization);

  const handleChangeStage = () => {
    dispatch(
      navigatePush(PERSON_STAGE_SCREEN, {
        onComplete: () => dispatch(getMyPeople()),
        currentStage: null,
        name: person.first_name,
        contactId: person.id,
        contactAssignmentId: contactAssignment.id,
        section: 'people',
        subsection: 'person',
        orgId: organization.id,
      }),
    );
  };

  const newPerson = isMe ? me : person;
  const personName = (isMe ? t('me') : newPerson.full_name || '').toUpperCase();

  const stage = isMe
    ? (me as any).stage
    : stagesObj[`${contactAssignment.pathway_stage_id}`];

  const isCruOrg = orgIsCru(organization);

  const orgPermissions = (person as any).organizational_permissions || [];
  const personOrgPermissions = orgPermissions.find(
    (orgPermission: any) => orgPermission.organization_id === organization.id,
  );

  const status =
    isMe || !isCruOrg || hasOrgPermissions(personOrgPermissions)
      ? ''
      : personOrgPermissions
      ? personOrgPermissions.followup_status || ''
      : 'uncontacted';

  const isUncontacted = status === 'uncontacted';

  return (
    <Touchable highlight={true} onPress={handleSelect}>
      <Flex direction="row" align="center" style={styles.row}>
        <Flex justify="center" value={1}>
          <ItemHeaderText text={personName} />
          <Flex direction="row" align="center">
            <Text style={styles.stage}>{stage ? stage.name : ''}</Text>
            <Text style={styles.stage}>{stage && status ? '  >  ' : null}</Text>
            <Text
              style={[styles.stage, isUncontacted ? styles.uncontacted : null]}
            >
              {status ? t(`followupStatus.${status.toLowerCase()}`) : null}
            </Text>
          </Flex>
        </Flex>
        {!isPersonal && !stage && !isMe ? (
          <Touchable
            testID="setStageButton"
            isAndroidOpacity={true}
            onPress={handleChangeStage}
          >
            <Icon
              name="journeyIcon"
              type="MissionHub"
              style={styles.uncontactedIcon}
            />
          </Touchable>
        ) : null}
      </Flex>
    </Touchable>
  );
};

const mapStateToProps = ({ auth, stages }: { auth: any; stages: any }) => ({
  me: auth.person,
  stagesObj: stages.stagesObj || {},
});

export default connect(mapStateToProps)(PersonItem);
