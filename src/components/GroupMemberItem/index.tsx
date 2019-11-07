/* eslint complexity: 0 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ORG_PERMISSIONS } from '../../constants';
import { Flex, Text, Dot, Card } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { orgIsUserCreated, isAdminOrOwner, isOwner } from '../../utils/common';
import ItemHeaderText from '../ItemHeaderText';

import { AuthState } from '../../reducers/auth';
import { StagesState } from '../../reducers/stages';
import { PersonProfileState } from '../../reducers/personProfile';
import { Person } from '../../reducers/people';
import { OrganizationsState } from '../../reducers/organizations';

import styles from './styles';

interface GroupMemberItemProps {
  onSelect: (person: Person) => void;
  person: Person;
  personOrgPermission: any;
  stagesObj: any;
  me: any;
  organization: any;
  iAmAdmin: boolean;
  iAmOwner: boolean;
  personIsOwner: boolean;
  personIsAdmin: boolean;
  isUserCreatedOrg: boolean;
}

const GroupMemberItem = ({
  onSelect,
  person,
  personOrgPermission,
  stagesObj,
  me,
  organization,
  iAmAdmin,
  iAmOwner,
  personIsOwner,
  personIsAdmin,
  isUserCreatedOrg,
}: GroupMemberItemProps) => {
  const { t } = useTranslation('groupItem');

  const handleSelect = () => {
    onSelect && onSelect(person);
  };

  const orgPermissionText = () => {
    if (!personOrgPermission) {
      return '';
    }

    switch (`${personOrgPermission.permission_id}`) {
      case ORG_PERMISSIONS.ADMIN:
        return t('profileLabels.admin');
      case ORG_PERMISSIONS.OWNER:
        return t('profileLabels.owner');
      default:
        return '';
    }
  };

  const renderUserCreatedDetails = (isMe: boolean) => {
    let stage = null;

    const contactAssignments = person.reverse_contact_assignments || [];
    if (isMe) {
      stage = me.stage;
    } else if (stagesObj) {
      const contactAssignment = contactAssignments.find(
        (a: any) => a.assigned_to.id === me.id,
      );
      if (
        contactAssignment &&
        contactAssignment.pathway_stage_id &&
        stagesObj[`${contactAssignment.pathway_stage_id}`]
      ) {
        stage = stagesObj[`${contactAssignment.pathway_stage_id}`];
      }
    }

    const permissionText = orgPermissionText();

    return (
      <Fragment>
        {stage ? <Text style={styles.detailText}>{stage.name}</Text> : null}
        {stage && permissionText ? <Dot style={styles.detailText} /> : null}
        {permissionText ? (
          <Text style={styles.detailText}>{orgPermissionText()}</Text>
        ) : null}
      </Fragment>
    );
  };
  // REMOVE_IN_SPLIT
  const renderCruDetails = () => {
    return (
      <Fragment>
        <Text style={styles.detailText}>
          {t('numAssigned', { count: person.contact_count || 0 })}
        </Text>
        {person.uncontacted_count ? (
          <Fragment>
            <Dot style={styles.detailText} />
            <Text style={styles.detailTextRed}>
              {t('numUncontacted', {
                count: person.uncontacted_count,
              })}
            </Text>
          </Fragment>
        ) : null}
      </Fragment>
    );
  };

  const isMe = person.id === me.id;
  const showOptionsMenu = isMe || (iAmAdmin && !personIsOwner);

  return (
    <Card onPress={handleSelect}>
      <Flex
        value={1}
        justify="center"
        align="center"
        direction="row"
        style={styles.content}
      >
        <Flex value={1} direction="column">
          <ItemHeaderText text={person.full_name} />
          <Flex align="center" direction="row">
            {isUserCreatedOrg
              ? renderUserCreatedDetails(isMe)
              : renderCruDetails()}
          </Flex>
        </Flex>
        {showOptionsMenu ? (
          <MemberOptionsMenu
            myId={me.id}
            person={person}
            organization={organization}
            personOrgPermission={personOrgPermission}
            iAmAdmin={iAmAdmin}
            iAmOwner={iAmOwner}
            personIsAdmin={personIsAdmin}
          />
        ) : null}
      </Flex>
    </Card>
  );
};

const mapStateToProps = (
  { auth, stages }: { auth: AuthState; stages: StagesState },
  {
    person,
    organization,
    myOrgPermission,
  }: {
    person: PersonProfileState;
    organization: OrganizationsState;
    myOrgPermission: any;
  },
) => {
  const personOrgPermission = orgPermissionSelector(
    {},
    {
      person,
      organization,
    },
  );

  return {
    me: auth.person,
    stagesObj: stages.stagesObj,
    iAmAdmin: isAdminOrOwner(myOrgPermission),
    iAmOwner: isOwner(myOrgPermission),
    personIsAdmin: isAdminOrOwner(personOrgPermission),
    personIsOwner: isOwner(personOrgPermission),
    isUserCreatedOrg: orgIsUserCreated(organization),
    personOrgPermission,
  };
};

export default connect(mapStateToProps)(GroupMemberItem);
