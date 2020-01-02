/* eslint complexity: 0 */

import React from 'react';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';

import { ORG_PERMISSIONS } from '../../constants';
import { Flex, Text, Dot, Card } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import {
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../../selectors/people';
import { stageSelector } from '../../selectors/stages';
import { orgIsUserCreated, isAdminOrOwner, isOwner } from '../../utils/common';
import ItemHeaderText from '../ItemHeaderText';
import { AuthState } from '../../reducers/auth';
import { StagesState, Stage } from '../../reducers/stages';
import { Person, OrgPermission } from '../../reducers/people';
import { Organization, MemberPerson } from '../../reducers/organizations';

import styles from './styles';

interface GroupMemberItemProps {
  onSelect: (person: MemberPerson) => void;
  person: MemberPerson;
  personOrgPermission?: OrgPermission;
  myId: string;
  stage?: Stage;
  organization: Organization;
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
  myId,
  stage,
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
    const permissionText = orgPermissionText();

    return (
      <>
        {stage ? <Text style={styles.detailText}>{stage.name}</Text> : null}
        {stage && permissionText ? <Dot style={styles.detailText} /> : null}
        {permissionText ? (
          <Text style={styles.detailText}>{orgPermissionText()}</Text>
        ) : null}
      </>
    );
  };
  // TODO: REMOVE_IN_SPLIT
  const renderCruDetails = () => {
    return (
      <>
        <Text style={styles.detailText}>
          {t('numAssigned', { count: person.contact_count || 0 })}
        </Text>
        {person.uncontacted_count ? (
          <>
            <Dot style={styles.detailText} />
            <Text style={styles.detailTextRed}>
              {t('numUncontacted', {
                count: person.uncontacted_count,
              })}
            </Text>
          </>
        ) : null}
      </>
    );
  };

  const isMe = person.id === myId;
  const showOptionsMenu = isMe || (iAmAdmin && !personIsOwner);

  return (
    <Card onPress={handleSelect} testID="GroupMemberItem">
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
            myId={myId}
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
    person: Person;
    organization: Organization;
    myOrgPermission: OrgPermission;
  },
) => {
  const personOrgPermission = orgPermissionSelector(
    {},
    {
      person,
      organization,
    },
  );

  const myId = auth.person.id;

  const stageId =
    person.id === myId
      ? auth.person.user.pathway_stage_id
      : (
          contactAssignmentSelector(
            { auth },
            { person, orgId: organization.id },
          ) || {}
        ).pathway_stage_id;
  const stage = stageId ? stageSelector({ stages }, { stageId }) : undefined;

  return {
    myId,
    stage,
    iAmAdmin: isAdminOrOwner(myOrgPermission),
    iAmOwner: isOwner(myOrgPermission),
    personIsAdmin: isAdminOrOwner(personOrgPermission),
    personIsOwner: isOwner(personOrgPermission),
    isUserCreatedOrg: orgIsUserCreated(organization),
    personOrgPermission,
  };
};

export default connect(mapStateToProps)(GroupMemberItem);
