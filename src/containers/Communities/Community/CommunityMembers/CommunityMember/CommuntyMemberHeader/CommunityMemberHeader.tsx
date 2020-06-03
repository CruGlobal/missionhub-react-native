import React from 'react';
import { View } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { Text } from '../../../../../../components/common';
import BackButton from '../../../../../../components/BackButton';
import Header from '../../../../../../components/Header';
import theme from '../../../../../../theme';
import Avatar from '../../../../../../components/Avatar';
import { ErrorNotice } from '../../../../../../components/ErrorNotice/ErrorNotice';
import { HeaderTabBar } from '../../../../../../components/HeaderTabBar/HeaderTabBar';
import {
  communityMemberTabs,
  CommunityMemberCollapsibleHeaderContext,
} from '../CommunityMemberTabs';

import { COMMUNITY_MEMBER_HEADER_QUERY } from './queries';
import {
  CommunityMemberHeader as CommunityMemberHeaderQuery,
  CommunityMemberHeaderVariables,
} from './__generated__/CommunityMemberHeader';
import styles from './styles';
import { CollapsibleViewHeader } from '../../../../../../components/CollapsibleView/CollapsibleView';

export const CommunityMemberHeader = () => {
  const { t } = useTranslation('communityMemberHeader');
  const personId: string = useNavigationParam('personId');

  const { data, error, refetch } = useQuery<
    CommunityMemberHeaderQuery,
    CommunityMemberHeaderVariables
  >(COMMUNITY_MEMBER_HEADER_QUERY, { variables: { personId } });

  return (
    <CollapsibleViewHeader
      context={CommunityMemberCollapsibleHeaderContext}
      headerHeight={287}
    >
      <View style={styles.container}>
        <Header left={<BackButton iconColor={theme.white} />} />
        <ErrorNotice
          message={t('errorLoadingPersonDetails')}
          error={error}
          refetch={refetch}
        />
        <View style={styles.content}>
          <Avatar size="large" person={data?.person} />
          <Text style={styles.personName}>{data?.person.fullName}</Text>
        </View>
        <HeaderTabBar tabs={communityMemberTabs} />
      </View>
    </CollapsibleViewHeader>
  );
};
