/* eslint complexity: 0 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex, Text, DateComponent, Dot, Touchable } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { isAdminOrOwner, isOwner } from '../../utils/common';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import Avatar from '../Avatar';
import { RootState } from '../../reducers';
import { useMyId } from '../../utils/hooks/useIsMe';

import styles from './styles';

interface CommunityMemberItemProps {
  onSelect: (person: Person) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person: any;
  organization: Organization;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personOrgPermission: any;
}

const CommunityMemberItem = ({
  onSelect,
  person,
  organization,
  personOrgPermission,
}: CommunityMemberItemProps) => {
  const { t } = useTranslation('groupItem');
  const myId = useMyId();
  const isMe = myId === person.id;
  const myOrgPermission = useSelector(({ auth }: RootState) =>
    orgPermissionSelector({}, { person: auth.person, organization }),
  );
  const iAmAdmin = isAdminOrOwner(myOrgPermission);
  const iAmOwner = isOwner(myOrgPermission);
  const personIsAdmin = isAdminOrOwner(personOrgPermission);
  const personIsOwner = isOwner(personOrgPermission);

  return (
    <Touchable
      onPress={() => onSelect(person)}
      testID="CommunityMemberItem"
      style={styles.card}
    >
      <Flex value={1} justify="center" align="center" direction="row">
        <Avatar size="small" person={person} style={styles.avatar} />
        <Flex value={1} direction="column">
          <Text style={styles.name}>{person.firstName}</Text>
          <Flex align="center" direction="row">
            <Text style={styles.info}>
              {personIsOwner ? (
                <>
                  {t('profileLabels.owner')}
                  <Dot />
                </>
              ) : null}
              {personIsAdmin ? (
                <>
                  {t('profileLabels.admin')}
                  <Dot />
                </>
              ) : null}
              {t('memberSince')}{' '}
              <DateComponent
                style={styles.info}
                date={person.createdAt}
                format="MMMM YYYY"
              />
            </Text>
          </Flex>
        </Flex>
        {isMe || (iAmAdmin && !personIsOwner) ? (
          <MemberOptionsMenu
            // @ts-ignore
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
    </Touchable>
  );
};

export default CommunityMemberItem;
