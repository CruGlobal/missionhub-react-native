import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Flex, Text, DateComponent, Dot, Touchable } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { isAdminOrOwner, isOwner } from '../../utils/common';
import { Organization } from '../../reducers/organizations';
import Avatar from '../Avatar';
import { useMyId, useIsMe } from '../../utils/hooks/useIsMe';
import { navigatePush } from '../../actions/navigation';
import { COMMUNITY_MEMBER_TABS } from '../../containers/Communities/Community/CommunityMembers/CommunityMember/CommunityMemberTabs';
import { CommunityMembers_community_people_edges_communityPermission } from '../../containers/Communities/Community/CommunityMembers/__generated__/CommunityMembers';

import styles from './styles';
import { CommunityMemberPerson } from './__generated__/CommunityMemberPerson';

interface CommunityMemberItemProps {
  person: CommunityMemberPerson;
  organization: Organization;
  myCommunityPermission?: CommunityMembers_community_people_edges_communityPermission;
  personOrgPermission: CommunityMembers_community_people_edges_communityPermission;
  onRefreshMembers: () => void;
}

const CommunityMemberItem = ({
  person,
  organization,
  personOrgPermission,
  onRefreshMembers,
  myCommunityPermission,
}: CommunityMemberItemProps) => {
  const { t } = useTranslation('groupItem');
  const dispatch = useDispatch();
  const myId = useMyId();
  const isMe = useIsMe(person.id);
  const iAmAdmin = isAdminOrOwner(myCommunityPermission);
  const iAmOwner = isOwner(myCommunityPermission);
  const personIsAdmin = isAdminOrOwner(personOrgPermission);
  const personIsOwner = isOwner(personOrgPermission);

  return (
    <Touchable
      onPress={() =>
        dispatch(
          navigatePush(COMMUNITY_MEMBER_TABS, {
            personId: person.id,
            communityId: organization.id,
          }),
        )
      }
      testID="CommunityMemberItem"
      style={styles.card}
    >
      <Flex value={1} justify="center" align="center" direction="row">
        <Avatar size="small" person={person} style={styles.avatar} />
        <Flex value={1} direction="column">
          <Text style={styles.name}>{person.fullName}</Text>
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
                date={personOrgPermission.createdAt}
                format="MMMM YYYY"
              />
            </Text>
          </Flex>
        </Flex>
        {isMe || (iAmAdmin && !personIsOwner) ? (
          <MemberOptionsMenu
            onActionTaken={onRefreshMembers}
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
