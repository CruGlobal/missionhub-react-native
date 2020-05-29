import React from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';

import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { keyExtractorId } from '../../utils/common';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import Header from '../../components/Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import NULL from '../../../assets/images/curiousIcon.png';
import { TrackStateContext } from '../../actions/analytics';
import { navigateBack } from '../../actions/navigation';
import ReportedItem from '../ReportedItem';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
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

interface GroupReportProps {
  analyticsPermissionType: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

const GroupReport = ({ analyticsPermissionType }: GroupReportProps) => {
  const { t } = useTranslation('groupsReport');
  useAnalytics(['celebrate', 'reported content'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
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

const mapStateToProps = (
  { auth }: { auth: AuthState },
  {
    navigation: {
      state: {
        params: { organization },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  analyticsPermissionType: getAnalyticsPermissionType(auth, organization),
});

export default connect(mapStateToProps)(GroupReport);
export const GROUPS_REPORT_SCREEN = 'nav/GROUPS_REPORT_SCREEN';
