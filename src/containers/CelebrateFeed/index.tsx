import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { DateComponent } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import { DateConstants } from '../../components/DateComponent';
import { keyExtractorId } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';
import ShareStoryInput from '../Groups/ShareStoryInput';

import styles from './styles';

class CelebrateFeed extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    // isListScrolled works around a known issue with SectionList in RN. see commit msg for details.
    this.state = { ...this.state, isListScrolled: false };
  }

  // @ts-ignore
  renderSectionHeader = ({ section: { date } }) => {
    const { title, header } = styles;

    return (
      <View style={header}>
        <DateComponent
          date={date}
          format={DateConstants.relative}
          style={title}
        />
      </View>
    );
  };

  // @ts-ignore
  renderItem = ({ item }) => {
    const {
      // @ts-ignore
      organization,
      // @ts-ignore
      itemNamePressable,
      // @ts-ignore
      onClearNotification,
      // @ts-ignore
      refreshCallback,
    } = this.props;

    return (
      <CelebrateItem
        onClearNotification={onClearNotification}
        event={item}
        organization={organization}
        namePressable={itemNamePressable}
        onRefresh={refreshCallback}
      />
    );
  };

  handleOnEndReached = () => {
    // @ts-ignore
    if (this.state.isListScrolled) {
      // @ts-ignore
      this.props.loadMoreItemsCallback();
      this.setState({ isListScrolled: false });
    }
  };

  handleEndDrag = () => {
    // @ts-ignore
    if (!this.state.isListScrolled) {
      this.setState({ isListScrolled: true });
    }
  };

  handleRefreshing = () => {
    // @ts-ignore
    this.props.refreshCallback();
  };

  renderHeader = () => {
    // @ts-ignore
    const { isMember, organization, dispatch, refreshCallback } = this.props;
    return (
      <>
        {/* 
      // @ts-ignore */}
        <CelebrateFeedHeader isMember={isMember} organization={organization} />
        <ShareStoryInput
          dispatch={dispatch}
          refreshItems={refreshCallback}
          organization={organization}
        />
      </>
    );
  };

  render() {
    // @ts-ignore
    const { items, refreshing, noHeader } = this.props;

    return (
      <SectionList
        sections={items}
        ListHeaderComponent={noHeader ? undefined : this.renderHeader}
        // @ts-ignore
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        keyExtractor={keyExtractorId}
        onEndReachedThreshold={0.2}
        onEndReached={this.handleOnEndReached}
        onScrollEndDrag={this.handleEndDrag}
        onRefresh={this.handleRefreshing}
        refreshing={refreshing || false}
        extraData={this.state}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    );
  }
}

// @ts-ignore
CelebrateFeed.propTypes = {
  items: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  refreshing: PropTypes.bool,
  refreshingCallback: PropTypes.func,
  itemNamePressable: PropTypes.bool,
  isMember: PropTypes.bool,
  noHeader: PropTypes.bool,
};

export default connect()(CelebrateFeed);
