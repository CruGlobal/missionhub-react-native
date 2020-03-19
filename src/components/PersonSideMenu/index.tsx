/* eslint max-lines-per-function: 0 */

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { deleteContactAssignment } from '../../actions/person';
import SideMenu, { MenuItemsType } from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { EDIT_PERSON_FLOW } from '../../routes/constants';
import { STATUS_REASON_SCREEN } from '../../containers/StatusReasonScreen';
import { assignContactAndPickStage } from '../../actions/misc';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../../selectors/people';
import {
  showAssignButton,
  showUnassignButton,
  showDeleteButton,
  orgIsCru,
  orgIsUserCreated,
} from '../../utils/common';
import { Person, PeopleState } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
import { useIsMe } from '../../utils/hooks/useIsMe';

interface PersonSideMenuProps {
  person: Person;
  contactAssignment: { id: string };
  organization?: Organization;
  personIsCurrentUser: boolean;
  orgPermission: { id: string };
}

const PersonSideMenu = ({
  person,
  contactAssignment,
  organization,
  orgPermission,
}: PersonSideMenuProps) => {
  const { t } = useTranslation('contactSideMenu');
  const dispatch = useDispatch();
  const [deleteOnUnmount, setDeleteOnUnmount] = useState(false);
  const isMe = useIsMe(person.id);

  const isCruOrg = orgIsCru(organization);
  const isUserCreated = orgIsUserCreated(organization);

  const onUnmount = () => {
    if (deleteOnUnmount) {
      dispatch(
        deleteContactAssignment(
          contactAssignment.id,
          person.id,
          organization && organization.id,
        ),
      );
    }
  };

  useEffect(() => {
    return onUnmount();
  }, []);

  const onSubmitReason = () => dispatch(navigateBack(2));

  const deleteContact = () => {
    return () => {
      Alert.alert(
        t('deleteQuestion', {
          name: person.first_name,
        }),
        t('deleteSentence'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: () => {
              // @ts-ignore
              setDeleteOnUnmount(true);
              dispatch(navigateBack(2)); // Navigate back since the contact is no longer in our list
            },
          },
        ],
      );
    };
  };

  const showAssign = showAssignButton(isCruOrg, isMe, contactAssignment);
  const showUnassign = showUnassignButton(isCruOrg, contactAssignment);
  const showDelete = showDeleteButton(isMe, contactAssignment, orgPermission);

  const menuItems = [
    !isUserCreated
      ? {
          label: t('edit'),
          action: () =>
            dispatch(
              navigatePush(EDIT_PERSON_FLOW, {
                person,
                organization,
              }),
            ),
        }
      : null,
    showDelete
      ? {
          label: t('delete'),
          action: deleteContact(),
        }
      : null,
    showAssign
      ? {
          label: t('assign'),
          action: () =>
            dispatch(assignContactAndPickStage(person, organization)),
        }
      : null,
    showUnassign
      ? {
          label: t('unassign'),
          action: () =>
            dispatch(
              navigatePush(STATUS_REASON_SCREEN, {
                person,
                organization,
                contactAssignment,
                onSubmit: onSubmitReason,
              }),
            ),
        }
      : null,
  ].filter(Boolean) as MenuItemsType[];

  return <SideMenu menuItems={menuItems} />;
};

const mapStateToProps = (
  { auth }: { auth: AuthState; people: PeopleState },
  {
    navigation: {
      state: {
        params: { person, organization },
      },
    },
  }: {
    navigation: {
      state: { params: { person: Person; organization: Organization } };
    };
  },
) => ({
  person,
  organization,
  contactAssignment: contactAssignmentSelector(
    { auth },
    { person, orgId: organization.id },
  ),
  orgPermission: orgPermissionSelector(
    {},
    {
      person,
      organization: { id: organization.id },
    },
  ),
});

export default connect(mapStateToProps)(PersonSideMenu);
