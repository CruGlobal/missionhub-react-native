import React from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';

import { keyExtractorId } from '../../utils/common';
import Header from '../../components/Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import NULL from '../../../assets/images/curiousIcon.png';
import { navigateBack } from '../../actions/navigation';
import ReportedItem from '../ReportedItem';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Organization } from '../../reducers/organizations';
import { REPORTED_ITEM_FRAGMENT } from '../ReportedItem/queries';

import {
  GetReportedContent,
  GetReportedContent_community_contentComplaints_nodes as ReportedItemInterface,
  GetReportedContentVariables,
} from './__generated__/GetReportedContent';
import styles from './styles';

export const GET_REPORTED_CONTENT = gql`
  query GetReportedContent(
    $id: ID!
    $commentsCursor: String # not used by this query but needed to make CommunityFeedItemCommentLike.comments fragment happy
  ) {
    community(id: $id) {
      id
      contentComplaints(ignored: false) {
        nodes {
          id
          ...ReportedItem
        }
      }
    }
  }
  ${REPORTED_ITEM_FRAGMENT}
`;

const GroupReport = () => {
  const { t } = useTranslation('groupsReport');
  const organization: Organization = useNavigationParam('organization');
  useAnalytics(
    ['celebrate', 'reported content'],
    { communityId: organization.id },
    {
      includePermissionType: true,
    },
  );
  const dispatch = useDispatch();
  const {
    data: {
      community: {
        contentComplaints: { nodes: ReportedContent = [] } = {},
      } = {},
    } = {},
    loading,
    refetch,
  } = useQuery<GetReportedContent, GetReportedContentVariables>(
    GET_REPORTED_CONTENT,
    {
      variables: {
        id: organization.id,
      },
    },
  );
  const renderItem = ({ item }: { item: ReportedItemInterface }) => {
    return <ReportedItem reportedItem={item} refetch={refetch} />;
  };

  const navigateOut = () => {
    return dispatch(navigateBack());
  };

  const renderList = () => {
    if (ReportedContent.length === 0) {
      return (
        <NullStateComponent
          imageSource={NULL}
          headerText={t('header').toUpperCase()}
          descriptionText={t('reportNull')}
        />
      );
    }
    return (
      <FlatList
        contentContainerStyle={styles.reportList}
        data={ReportedContent}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    );
  };

  return (
    <View style={styles.greyPageContainer}>
      <Header
        right={
          <IconButton
            testID="closeButton"
            name="deleteIcon"
            type="MissionHub"
            onPress={navigateOut}
          />
        }
        style={styles.reportHeader}
        title={t('title')}
      />
      {renderList()}
    </View>
  );
};

export default GroupReport;
export const GROUPS_REPORT_SCREEN = 'nav/GROUPS_REPORT_SCREEN';
