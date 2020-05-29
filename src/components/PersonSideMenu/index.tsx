/* eslint max-lines-per-function: 0 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';

import { deleteContactAssignment } from '../../actions/person';
import SideMenu, { MenuItemsType } from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { EDIT_PERSON_FLOW } from '../../routes/constants';
import { STATUS_REASON_SCREEN } from '../../containers/StatusReasonScreen';
import { assignContactAndPickStage } from '../../actions/misc';
import {
  selectContactAssignment,
  selectOrgPermission,
} from '../../selectors/people';
import {
  showAssignButton,
  showUnassignButton,
  showDeleteButton,
  orgIsCru,
  orgIsUserCreated,
} from '../../utils/common';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
import { useIsMe } from '../../utils/hooks/useIsMe';

export const PersonSideMenu = () => {
  const { t } = useTranslation('contactSideMenu');
  const dispatch = useDispatch();
  const person: Person = useNavigationParam('person');
  const organization: Organization | null =
    useNavigationParam('organization') || null;
  const isMe = useIsMe(person.id);
  const contactAssignment: {
    id: string;
  } = useSelector(({ auth }: { auth: AuthState }) =>
    selectContactAssignment(person, auth.person.id, organization?.id),
  );
  const orgPermission = selectOrgPermission(person, organization);

  const isCruOrg = orgIsCru(organization);
  const isUserCreated = orgIsUserCreated(organization);

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
              dispatch(
                deleteContactAssignment(
                  contactAssignment.id,
                  person.id,
                  organization?.id,
                ),
              );
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
          action: () => dispatch(assignContactAndPickStage(person)),
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
  return <SideMenu testID="SideMenu" menuItems={menuItems} />;
};
