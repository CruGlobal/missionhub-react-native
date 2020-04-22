/* eslint complexity: 0 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex, Text, DateComponent, Dot, Touchable } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { isAdminOrOwner, isOwner } from '../../utils/common';
import { AuthState } from '../../reducers/auth';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import Avatar from '../Avatar';
import { useIsMe } from '../../utils/hooks/useIsMe';

import styles from './styles';

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
      style={styles.card}
    >
      <Flex value={1} justify="center" align="center" direction="row">
        <Avatar size="small" person={person} style={styles.avatar} />
        <Flex value={1} direction="column">
          <Text style={styles.name}>{person.first_name}</Text>
          <Flex align="center" direction="row">
            <Text style={styles.info}>
              {personIsOwner ? (
                <>
                  {t('profileLabels.owner')}
                  <Dot />
                </>
              ) : null}
              {t('memberSince')}{' '}
              <DateComponent
                style={styles.info}
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
