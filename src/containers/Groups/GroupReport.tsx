import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';

import { refresh, keyExtractorId } from '../../utils/common';
import Header from '../../components/Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import { getReportedComments } from '../../actions/reportComments';
import NULL from '../../../assets/images/curiousIcon.png';
import { navigateBack } from '../../actions/navigation';
import ReportCommentItem from '../ReportCommentItem';
import Analytics from '../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('groupsReport')
export class GroupReport extends Component {
  state = { refreshing: false };

  loadItems = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    return dispatch(getReportedComments(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.loadItems);
  };

  // @ts-ignore
  renderItem = ({ item }) => (
    // @ts-ignore
    <ReportCommentItem item={item} organization={this.props.organization} />
  );

  // @ts-ignore
  navigateBack = () => this.props.dispatch(navigateBack());

  renderList = () => {
    const { refreshing } = this.state;
    // @ts-ignore
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
    // @ts-ignore
    const { t } = this.props;

    return (
      <View style={styles.redPageContainer}>
        <Analytics screenName={['celebrate', 'reported comments']} />
        <Header
          right={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          // @ts-ignore
          style={styles.reportHeader}
          title={t('title')}
        />
        {this.renderList()}
      </View>
    );
  }
}

const mapStateToProps = (
  // @ts-ignore
  { reportedComments },
  {
    navigation: {
      state: {
        // @ts-ignore
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
