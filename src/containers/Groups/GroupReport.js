import React, { Component } from 'react';
import { Alert, FlatList, View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { refresh, keyExtractorId } from '../../utils/common';
import Header from '../Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import {
  getReportedComments,
  ignoreReportComment,
  deleteCelebrateComment,
} from '../../actions/celebrateComments';
import NULL from '../../../assets/images/curiousIcon.png';
import { navigateBack } from '../../actions/navigation';
import { organizationSelector } from '../../selectors/organizations';
import ReportCommentItem from '../../components/ReportCommentItem';

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
    <ReportCommentItem
      item={item}
      onIgnore={this.handleIgnore}
      onDelete={this.handleDelete}
    />
  );

  navigateBack = () => this.props.dispatch(navigateBack());

  handleIgnore = async item => {
    const { dispatch, organization } = this.props;
    await dispatch(ignoreReportComment(organization.id, item.id));
    this.loadItems();
  };

  handleDelete = item => {
    const { t, dispatch, organization } = this.props;
    Alert.alert(t('deleteTitle'), '', [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('ok'),
        onPress: async () => {
          await dispatch(
            deleteCelebrateComment(
              organization.id,
              item.organization_celebration_item,
              item,
            ),
          );
          this.loadItems();
        },
      },
    ]);
  };

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
        style={styles.reportList}
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
  { organizations },
  {
    navigation: {
      state: {
        params: { organization },
      },
    },
  },
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  const reportedComments = selectorOrg.reportedComments || [];
  return {
    organization: selectorOrg,
    reportedComments,
  };
};

export default connect(mapStateToProps)(GroupReport);
export const GROUPS_REPORT_SCREEN = 'nav/GROUPS_REPORT_SCREEN';
