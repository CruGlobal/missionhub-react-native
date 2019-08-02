import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { DateComponent } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { navigatePush } from '../../actions/navigation';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import { DateConstants } from '../../components/DateComponent';
import { keyExtractorId } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';

import styles from './styles';

class CelebrateFeed extends Component {
  constructor(props) {
    super(props);
    // isListScrolled works around a known issue with SectionList in RN. see commit msg for details.
    this.state = { ...this.state, isListScrolled: false };
  }

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

  onPressItem = event => {
    const { dispatch } = this.props;

    dispatch(
      navigatePush(CELEBRATE_DETAIL_SCREEN, {
        event,
      }),
    );
  };

  renderItem = ({ item }) => {
    const { organization, itemNamePressable, onClearNotification } = this.props;

    return (
      <CelebrateItem
        onClearNotification={onClearNotification}
        event={item}
        organization={organization}
        onPressItem={
          organization.id !== GLOBAL_COMMUNITY_ID && this.onPressItem
        }
        namePressable={itemNamePressable}
      />
    );
  };

  handleOnEndReached = () => {
    if (this.state.isListScrolled) {
      this.props.loadMoreItemsCallback();
      this.setState({ isListScrolled: false });
    }
  };

  handleEndDrag = () => {
    if (!this.state.isListScrolled) {
      this.setState({ isListScrolled: true });
    }
  };

  handleRefreshing = () => {
    this.props.refreshCallback();
  };

  renderHeader = () => {
    const { isMember, organization } = this.props;
    return (
      <CelebrateFeedHeader isMember={isMember} organization={organization} />
    );
  };

  render() {
    const { items, refreshing, noHeader } = this.props;

    return (
      <SectionList
        sections={items}
        ListHeaderComponent={noHeader ? undefined : this.renderHeader}
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

CelebrateFeed.propTypes = {
  items: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  refreshing: PropTypes.bool,
  itemNamePressable: PropTypes.bool,
  isMember: PropTypes.bool,
  noHeader: PropTypes.bool,
};

export default connect()(CelebrateFeed);
