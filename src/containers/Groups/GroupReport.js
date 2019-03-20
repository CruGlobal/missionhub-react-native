import React, { Component } from 'react';
import { FlatList, View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { refresh, keyExtractorId } from '../../utils/common';
import Header from '../Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import { getReportedComments } from '../../actions/reportComments';
import NULL from '../../../assets/images/curiousIcon.png';
import { navigateBack } from '../../actions/navigation';
import ReportCommentItem from '../ReportCommentItem';

import styles from './styles';

@translate('groupsReport')
export class GroupReport extends Component {
  state = { refreshing: false };

  loadItems = () => {
    const { dispatch, organization } = this.props;
    return dispatch(getReportedComments(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.loadItems);
  };

  renderItem = ({ item }) => (
    <ReportCommentItem item={item} organization={this.props.organization} />
  );

  navigateBack = () => this.props.dispatch(navigateBack());

  renderList = () => {
    const { refreshing } = this.state;
    const { t, reportedComments } = this.props;
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
        renderItem={this.renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.refreshItems}
          />
        }
      />
    );
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.pageContainer}>
        <Header
          right={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          style={styles.reportHeader}
          title={t('title')}
        />
        <SafeAreaView style={{ flex: 1 }}>{this.renderList()}</SafeAreaView>
      </View>
    );
  }
}

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
