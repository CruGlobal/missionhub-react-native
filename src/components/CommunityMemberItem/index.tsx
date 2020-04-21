/* eslint complexity: 0 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ORG_PERMISSIONS } from '../../constants';
import { Flex, Text, DateComponent, Dot, Touchable } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { orgIsUserCreated, isAdminOrOwner, isOwner } from '../../utils/common';
import ItemHeaderText from '../ItemHeaderText';
import { AuthState } from '../../reducers/auth';
import { StagesState, StagesObj } from '../../reducers/stages';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import Avatar from '../Avatar';
import theme from '../../theme';
import { useIsMe } from '../../utils/hooks/useIsMe';

import styles from './styles';

interface PersonOrgPermissionInterface {
  archive_date: string | null;
  cru_status: string;
  followup_status: string | null;
  id: string;
  organization: Organization;
  organization_id: string;
  permission_id: number;
}

interface CommunityMemberItemProps {
  onSelect: (person: Person) => void;
  person: Person;
  organization: Organization;
}

const CommunityMemberItem = ({
  onSelect,
  person,
  organization,
}: CommunityMemberItemProps) => {
  const { t } = useTranslation('groupItem');
  const me = useSelector(({ auth }: { auth: AuthState }) => auth.person);
  const myOrgPermission = useSelector(({ auth }: { auth: AuthState }) =>
    orgPermissionSelector({}, { person: auth.person, organization }),
  );
  const personOrgPermission = useSelector(() =>
    orgPermissionSelector({}, { person, organization }),
  );
  const iAmAdmin = isAdminOrOwner(myOrgPermission);
  const iAmOwner = isOwner(myOrgPermission);
  const personIsAdmin = isAdminOrOwner(personOrgPermission);
  const personIsOwner = isOwner(personOrgPermission);
  const isMe = useIsMe(person.id);

  return (
    <Touchable
      onPress={() => onSelect(person)}
      testID="CommunityMemberItem"
      style={{
        shadowColor: theme.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderRadius: 8,
        backgroundColor: theme.white,
        marginHorizontal: 0,
        marginVertical: 4,
        paddingVertical: 14,
        paddingLeft: 14,
      }}
    >
      <Flex value={1} justify="center" align="center" direction="row">
        <Avatar size="small" person={person} style={{ marginRight: 8 }} />
        <Flex value={1} direction="column">
          <Text
            style={{
              color: theme.grey,
              fontSize: 16,
            }}
          >
            {person.first_name}
          </Text>
          <Flex align="center" direction="row">
            <Text
              style={{
                color: theme.lightGrey,
                fontSize: 12,
              }}
            >
              {personIsOwner ? (
                <>
                  ${t('profileLabels.owner')}
                  <Dot />
                </>
              ) : null}
              {t('memberSince')}{' '}
              <DateComponent
                style={{
                  color: theme.lightGrey,
                  fontSize: 12,
                }}
                date={person.created_at}
                format="MMMM YYYY"
              />
            </Text>
          </Flex>
        </Flex>
        {isMe || (iAmAdmin && !personIsOwner) ? (
          <MemberOptionsMenu
            // @ts-ignore
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
    </Touchable>
  );
};

export default CommunityMemberItem;
