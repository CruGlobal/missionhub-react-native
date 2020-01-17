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
import ReportCommentItem from '../ReportCommentItem';
import Analytics from '../Analytics';
import { Organization } from '../../reducers/organizations';

import {
  GetReportedContent,
  GetReportedContent_community_contentComplaints_nodes as ReportedItem,
} from './__generated__/GetReportedContent';
import styles from './styles';

export const GET_REPORTED_CONTENT = gql`
  query GetReportedContent($id: ID!) {
    community(id: $id) {
      contentComplaints(ignored: false) {
        nodes {
          id
          subject {
            typeName: __typename
            ... on Story {
              content
              createdAt
              id
              author {
                fullName
                firstName
                lastName
                id
              }
            }
            ... on CommunityCelebrationItemComment {
              content
              createdAt
              id
              person {
                fullName
                firstName
                lastName
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

  const renderItem = ({ item }: { item: ReportedItem }) => {
    return (
      <ReportCommentItem
        item={item}
        organization={organization}
        refetch={refetch}
      />
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
    <View style={styles.redPageContainer}>
      <Analytics screenName={['celebrate', 'reported comments']} />
      <Header
        right={
          <IconButton
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
