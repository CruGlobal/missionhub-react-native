import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';

import { keyExtractorId } from '../../utils/common';
import Header from '../../components/Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import { getReportedComments } from '../../actions/reportComments';
import NULL from '../../../assets/images/curiousIcon.png';
import { navigateBack } from '../../actions/navigation';
import ReportCommentItem from '../ReportCommentItem';
import Analytics from '../Analytics';

import styles from './styles';

const GroupReport = ({ organization, dispatch, reportedComments }) => {
  const { t } = useTranslation('groupsReport');

  const [refreshing, setRefreshing] = useState(false);

  const loadItems = async () => {
    const reportedContent = await dispatch(
      getReportedComments(organization.id),
    );
    setRefreshing(false);
    return reportedContent;
  };

  const refreshItems = () => {
    setRefreshing(true);
    loadItems();
  };

  const renderItem = ({ item }) => {
    return <ReportCommentItem item={item} organization={organization} />;
  };

  const navigateOut = () => {
    return dispatch(navigateBack());
  };

  const renderList = () => {
    if (reportedComments.length === 0) {
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
        data={reportedComments}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshItems} />
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

const mapStateToProps = (
  { reportedComments },
  {
    navigation: {
      state: {
        params: { organization },
      },
    },
  },
) => ({
  organization,
  reportedComments: reportedComments.all[organization.id] || [],
});

export default connect(mapStateToProps)(GroupReport);
export const GROUPS_REPORT_SCREEN = 'nav/GROUPS_REPORT_SCREEN';
