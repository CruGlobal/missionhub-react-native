import React from 'react';
import { View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { Text, Button } from '../common';
import BackButton from '../BackButton';
import Header from '../Header';
import theme from '../../theme';
import Avatar from '../Avatar';
import { ErrorNotice } from '../ErrorNotice/ErrorNotice';
import { HeaderTabBar, HeaderTabs } from '../HeaderTabBar/HeaderTabBar';
import {
  CollapsibleViewHeader,
  CollapsibleViewContext,
} from '../CollapsibleView/CollapsibleView';
import EditIcon from '../../../assets/images/editIcon.svg';
import PopupMenu from '../PopupMenu';
import KebabIcon from '../../../assets/images/kebabIcon.svg';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { EDIT_PERSON_FLOW } from '../../routes/constants';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { deleteContactAssignment } from '../../actions/person';

import { PERSON_HEADER_QUERY } from './queries';
import {
  PersonHeader as PersonHeaderQuery,
  PersonHeaderVariables,
} from './__generated__/PersonHeader';
import styles from './styles';

interface PersonHeaderProps {
  isMember?: boolean;
  collapsibleHeaderContext: CollapsibleViewContext;
  tabs: HeaderTabs;
}

export const PersonHeader = ({
  isMember = false,
  collapsibleHeaderContext,
  tabs,
}: PersonHeaderProps) => {
  const { t } = useTranslation('personHeader');
  const dispatch = useDispatch();

  const personId: string = useNavigationParam('personId');
  const isMe = useIsMe(personId);

  const { data, error, refetch } = useQuery<
    PersonHeaderQuery,
    PersonHeaderVariables
  >(PERSON_HEADER_QUERY, {
    variables: { personId, includeStage: !isMember },
  });

  const editPerson = () =>
    dispatch(
      navigatePush(EDIT_PERSON_FLOW, {
        person: { id: personId },
      }),
    );

  const deletePerson = () =>
    Alert.alert(
      t('deletePersonQuestion', {
        name: data?.person.fullName,
      }),
      t('deletePersonSentence'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            dispatch(deleteContactAssignment(personId));
            dispatch(navigateBack());
          },
        },
      ],
    );

  return (
    <CollapsibleViewHeader
      context={collapsibleHeaderContext}
      headerHeight={isMember ? 287 : 304}
    >
      <View style={styles.container}>
        <Header
          left={<BackButton iconColor={theme.white} />}
          right={
            !isMember ? (
              isMe ? (
                <Button testID="editButton" onPress={editPerson}>
                  <EditIcon color={theme.white} />
                </Button>
              ) : (
                <PopupMenu
                  actions={[
                    {
                      text: t('editPerson'),
                      onPress: editPerson,
                    },
                    {
                      text: t('deletePerson'),
                      onPress: deletePerson,
                      destructive: true,
                    },
                  ]}
                >
                  <KebabIcon
                    color={theme.white}
                    style={{ paddingHorizontal: 24 }}
                  />
                </PopupMenu>
              )
            ) : null
          }
        />
        <ErrorNotice
          message={t('errorLoadingPersonDetails')}
          error={error}
          refetch={refetch}
        />
        <View style={styles.content}>
          <Avatar size="large" person={data?.person} style={styles.avatar} />
          <Text style={styles.personName}>{data?.person.fullName}</Text>
          {!isMember ? (
            <Text style={styles.stage}>
              {data?.person.stage?.name?.toUpperCase()}
            </Text>
          ) : null}
        </View>
        <HeaderTabBar tabs={tabs} />
      </View>
    </CollapsibleViewHeader>
  );
};
