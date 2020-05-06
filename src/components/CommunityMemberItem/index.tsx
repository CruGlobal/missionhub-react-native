/* eslint complexity: 0 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { Flex, Text, DateComponent, Dot, Touchable } from '../common';
import { hasOrgPermissions } from '../../utils/common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { isAdminOrOwner, isOwner } from '../../utils/common';
import { Organization } from '../../reducers/organizations';
import Avatar from '../Avatar';
import { RootState } from '../../reducers';
import { useMyId, useIsMe } from '../../utils/hooks/useIsMe';
import { PermissionEnum } from '../../../__generated__/globalTypes';
import { UNASSIGNED_PERSON_SCREEN } from '../../containers/Groups/UnassignedPersonScreen';
import { navigatePush } from '../../actions/navigation';
import {
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  MEMBER_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  ME_COMMUNITY_PERSON_SCREEN,
} from '../../containers/Groups/AssignedPersonScreen/constants';

import styles from './styles';
import { CommunityMemberPerson } from './__generated__/CommunityMemberPerson';

export interface CommunityMemberItemProps {
  person: CommunityMemberPerson;
  organization: Organization;
  personOrgPermission: { id: string; permission: PermissionEnum };
}

const CommunityMemberItem = ({
  person,
  organization,
  personOrgPermission,
}: CommunityMemberItemProps) => {
  const { t } = useTranslation('groupItem');
  const dispatch = useDispatch();
  const me = useSelector(({ auth }: RootState) => auth.person);
  const myId = useMyId();
  const isMe = useIsMe(person.id);
  const myOrgPermission = useSelector(({ auth }: RootState) =>
    orgPermissionSelector({}, { person: auth.person, organization }),
  );
  const iAmAdmin = isAdminOrOwner(myOrgPermission);
  const iAmOwner = isOwner(myOrgPermission);
  const personIsAdmin = isAdminOrOwner(personOrgPermission);
  const personIsOwner = isOwner(personOrgPermission);
  const personIsMember = hasOrgPermissions(personOrgPermission);

  // TODO: This was pulled from the "actions/person.ts"->"navToPersonScreen" action
  // That function uses the redux organization and person for all of the contact assignment information
  // We now need to use the graphQL information instead. Leaving this in here for now so that it will
  // continue working until we get a new person screen and navToPerson function hooked up with graphQL
  function getScreen() {
    const isUserCreatedOrg = organization.user_created;
    const isGroups = me.user?.groups_feature;

    if (isMe) {
      if (personIsMember) {
        if (isGroups) {
          return IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN;
        }
        return ME_COMMUNITY_PERSON_SCREEN;
      }
      return ME_PERSONAL_PERSON_SCREEN;
    }

    if (personIsMember) {
      if (isUserCreatedOrg) {
        return IS_USER_CREATED_MEMBER_PERSON_SCREEN;
      }
      if (isGroups) {
        return IS_GROUPS_MEMBER_PERSON_SCREEN;
      }
      return MEMBER_PERSON_SCREEN;
    }

    return UNASSIGNED_PERSON_SCREEN;
  }

  function navToPerson() {
    dispatch(
      navigatePush(getScreen(), {
        person,
        organization,
        isMember: personIsMember,
      }),
    );
  }

  return (
    <Touchable
      onPress={navToPerson}
      testID="CommunityMemberItem"
      style={styles.card}
    >
      <Flex value={1} justify="center" align="center" direction="row">
        {person ? (
          <Avatar size="small" person={person} style={styles.avatar} />
        ) : null}
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
