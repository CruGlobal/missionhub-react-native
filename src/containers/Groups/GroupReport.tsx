import React from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';

import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { keyExtractorId } from '../../utils/common';
import Header from '../../components/Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import NULL from '../../../assets/images/curiousIcon.png';
import { navigateBack } from '../../actions/navigation';
import ReportedItem from '../ReportedItem';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Organization } from '../../reducers/organizations';

import {
  GetReportedContent,
  GetReportedContent_community_contentComplaints_nodes as ReportedItemInterface,
} from './__generated__/GetReportedContent';
import styles from './styles';

export const GET_REPORTED_CONTENT = gql`
  query GetReportedContent($id: ID!) {
    community(id: $id) {
      contentComplaints(ignored: false) {
        nodes {
          id
          subject {
            __typename
            ... on Story {
              content
              createdAt
              updatedAt
              id
              author {
                fullName
                firstName

                id
              }
            }
            ... on CommunityCelebrationItemComment {
              content
              createdAt
              updatedAt
              id
              person {
                fullName
                firstName

                id
              }
            }
          }
          person {
            fullName
          }
        }
      }
    }
  }
`;

const GroupReport = () => {
  const { t } = useTranslation('groupsReport');
  useAnalytics({
    screenName: ['celebrate', 'reported content'],
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: '' },
  });
  const dispatch = useDispatch();
  const organization: Organization = useNavigationParam('organization');
  const {
    data: {
      community: {
        contentComplaints: { nodes: ReportedContent = [] } = {},
      } = {},
    } = {},
    loading,
    refetch,
  } = useQuery<GetReportedContent>(GET_REPORTED_CONTENT, {
    variables: {
      id: organization.id,
    },
  });
  const renderItem = ({ item }: { item: ReportedItemInterface }) => {
    return (
      <ReportedItem item={item} refetch={refetch} organization={organization} />
    );
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
