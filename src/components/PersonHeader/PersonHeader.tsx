import React from 'react';
import { View } from 'react-native';
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
import { navigatePush } from '../../actions/navigation';
import { EDIT_PERSON_FLOW } from '../../routes/constants';

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

  const { data, error, refetch } = useQuery<
    PersonHeaderQuery,
    PersonHeaderVariables
  >(PERSON_HEADER_QUERY, {
    variables: { personId, includeStage: !isMember },
  });

  return (
    <CollapsibleViewHeader
      context={collapsibleHeaderContext}
      headerHeight={287}
    >
      <View style={styles.container}>
        <Header
          left={<BackButton iconColor={theme.white} />}
          right={
            !isMember ? (
              <Button
                onPress={() =>
                  dispatch(
                    navigatePush(EDIT_PERSON_FLOW, {
                      person: { id: personId },
                    }),
                  )
                }
              >
                <EditIcon color={theme.white} />
              </Button>
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
